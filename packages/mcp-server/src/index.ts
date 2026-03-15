#!/usr/bin/env node

import { createServer } from "./server.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const server = createServer();

export function createSandboxServer() {
  return server;
}

const transport = process.env.TRANSPORT || "stdio";

if (process.env.NODE_ENV !== "test" && process.env.SMITHERY !== "true") {
  if (transport === "http") {
    import("node:http").then(({ createServer }) => {
      const httpServer = createServer(async (req, res) => {
        // Only handle /mcp path
        if (req.url !== "/mcp") {
          res.writeHead(404);
          res.end("Not Found. MCP endpoint is at /mcp");
          return;
        }

        // Collect request body for POST requests
        const bodyChunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => bodyChunks.push(chunk));
        req.on("end", async () => {
          let parsedBody: unknown;
          if (req.method === "POST" && bodyChunks.length > 0) {
            try {
              parsedBody = JSON.parse(Buffer.concat(bodyChunks).toString());
            } catch {
              parsedBody = undefined;
            }
          }

          const httpTransport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
          });

          httpTransport.onclose = () => {
            // Session closed
          };

          await server.connect(httpTransport);
          await httpTransport.handleRequest(req, res, parsedBody);
        });
      });

      const port = parseInt(process.env.PORT || "3000", 10);
      httpServer.listen(port, () => {
        console.error(`MCP HTTP server listening on http://localhost:${port}/mcp`);
      });
    });
  } else {
    const stdioTransport = new StdioServerTransport();
    server.connect(stdioTransport).catch((err: unknown) => {
      console.error("Failed to connect MCP server:", err);
      process.exit(1);
    });
  }
}
