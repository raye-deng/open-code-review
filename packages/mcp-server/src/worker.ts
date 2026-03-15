import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";

// ── explain_issue tool (no fs dependency) ──

const CATEGORY_EXPLANATIONS: Record<string, string> = {
  "hallucinated-import":
    "The code imports a package that does not exist in the npm registry. This is a common AI hallucination — the model invented a plausible-sounding package name that has never been published. Remove the import and replace with a real package, or implement the functionality inline.",
  "phantom-package":
    "A dependency is declared in package.json but never actually imported or used anywhere in the source code. This bloats the install size and may indicate an AI added an unnecessary dependency.",
  "stale-api":
    "The code calls an API or uses a function signature that has been deprecated or removed in the current version of the library. Check the library's changelog and migration guide for the replacement.",
  "context-break":
    "The code contains logic that appears inconsistent with the surrounding context — possibly caused by an AI losing track of what it was building mid-generation. Review the surrounding code for coherence.",
  duplication:
    "Significant code duplication detected. This may indicate the AI copy-pasted code blocks without abstracting shared logic. Consider extracting a shared function or utility.",
  "security-pattern":
    "A potential security anti-pattern was detected (e.g., hardcoded secrets, eval usage, SQL injection risk, path traversal). This requires immediate review.",
  overengineering:
    "The code is unnecessarily complex for what it does. AI models tend to add extra abstraction layers, generic types, or design patterns that aren't needed. Simplify the implementation.",
};

const explainIssueSchema = z.object({
  issue: z.string().describe("The issue description to explain"),
  file: z.string().optional().describe("File path where the issue was found"),
  line: z.number().optional().describe("Line number where the issue was found"),
  severity: z
    .string()
    .optional()
    .describe("Issue severity (critical/high/medium/low/info)"),
  category: z.string().optional().describe("Issue category"),
  suggestion: z
    .string()
    .optional()
    .describe("Auto-generated fix suggestion"),
});

async function handleExplainIssue(args: z.infer<typeof explainIssueSchema>) {
  const categoryExplanation = args.category
    ? CATEGORY_EXPLANATIONS[args.category]
    : null;

  const explanation = {
    issue: args.issue,
    file: args.file ?? null,
    line: args.line ?? null,
    severity: args.severity ?? null,
    category: args.category ?? null,
    suggestion: args.suggestion ?? null,
    categoryExplanation,
    analysis: `This is a ${args.severity ?? "unknown"} severity issue in the "${args.category ?? "uncategorized"}" category. ${categoryExplanation ?? "Review the flagged code and consider the suggestion for resolution."}`,
  };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(explanation, null, 2),
      },
    ],
  };
}

// ── MCP Server setup ──

function createCloudflareServer(): Server {
  const server = new Server(
    { name: "open-code-review", version: "1.0.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "explain_issue",
        description:
          "Explain a code quality issue detected by Open Code Review (OCR). Returns detailed explanation, category context, and fix guidance for the AI agent to act on.",
        inputSchema: {
          type: "object" as const,
          properties: {
            issue: {
              type: "string",
              description: "The issue description to explain",
            },
            file: {
              type: "string",
              description: "File path where the issue was found",
            },
            line: { type: "number", description: "Line number" },
            severity: {
              type: "string",
              description: "Severity: critical/high/medium/low/info",
            },
            category: { type: "string", description: "Issue category" },
            suggestion: {
              type: "string",
              description: "Auto-generated fix suggestion",
            },
          },
          required: ["issue"],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
      case "explain_issue": {
        const parsed = explainIssueSchema.parse(args);
        return handleExplainIssue(parsed);
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  return server;
}

// ── Worker fetch handler ──

const mcpServer = createCloudflareServer();

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok", service: "open-code-review-mcp" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // MCP endpoint
    if (url.pathname === "/mcp") {
      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

      transport.onclose = () => {};

      await mcpServer.connect(transport);
      return transport.handleRequest(request);
    }

    return new Response("Not Found. MCP endpoint is at /mcp", { status: 404 });
  },
};
