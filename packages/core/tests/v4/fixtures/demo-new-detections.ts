// ============================================================================
// Demo file: AI-generated code with NEW detection patterns
// This file demonstrates the three new detection capabilities added in v2.2.0:
// 1. Shell template literal injection
// 2. Sensitive data in error responses
// 3. Excessive decorator chains
// 4. Cloud/service key patterns
// ============================================================================

import { execSync } from 'child_process';

// ── 1. Shell Template Literal Injection ────────────────────────────
// AI commonly generates child_process calls with template strings,
// creating command injection vectors that bypass simple eval() detection.

export function cleanupDirectory(userDir: string) {
  // AI-generated: looks convenient but enables command injection
  execSync(`rm -rf ${userDir}/tmp`);
  execSync(`tar -czf backup.tar.gz ${userDir}`);
}

export function searchFiles(query: string) {
  // AI-generated: string concatenation in exec
  const result = execSync("grep -r " + query + " /var/log/");
  return result.toString();
}

// ── 2. Sensitive Data in Error Responses ───────────────────────────
// AI commonly generates error handlers that leak internal details.

export async function getUser(req: any, res: any) {
  try {
    const user = await findUser(req.params.id);
    res.json(user);
  } catch (err: any) {
    // AI-generated: leaks stack trace to API consumer
    res.json({ error: err.message, stack: err.stack, trace: err.trace });
  }
}

// ── 3. Excessive Decorator Chains ──────────────────────────────────
// AI loves stacking decorators — often unnecessarily.

@Injectable
@Validated
@Cacheable
@Logged
@Timed
@Monitored
class UserService {
  @Get("/users")
  @Auth("admin")
  @RateLimit(100)
  @Cache(300)
  @Validate
  async getUsers() {
    return [];
  }
}

// ── 4. Cloud/Service Key Patterns ──────────────────────────────────
// AI copies these from documentation examples.

// These are intentionally zeroed-out fake values for detection testing
const stripeKey = "sk_test_00000000000000000000";
const githubToken = "ghp_000000000000000000000000000000000000";
const slackToken = "xoxb-0000000000-0000000000";

// ── Helper stubs ───────────────────────────────────────────────────
function findUser(id: string) { return { id }; }
function Injectable(t: any) {}
function Validated(t: any) {}
function Cacheable(t: any) {}
function Logged(t: any) {}
function Timed(t: any) {}
function Monitored(t: any) {}
function Get(p: string) { return (t: any, k: string) => {}; }
function Auth(r: string) { return (t: any, k: string) => {}; }
function RateLimit(n: number) { return (t: any, k: string) => {}; }
function Cache(n: number) { return (t: any, k: string) => {}; }
function Validate(t: any, k: string) {}
