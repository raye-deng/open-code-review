/**
 * Demo: AI-Generated Code with Example API Keys
 *
 * This file simulates common AI coding patterns where the model
 * copies example API keys from documentation into the generated code.
 *
 * Traditional security scanners often miss these because:
 * - The keys look like real API keys (valid format)
 * - They're not in a "hardcoded secrets" blacklist
 * - They're not obvious dictionary words like "password123"
 *
 * Open Code Review detects these as AI-specific anti-patterns.
 */

// ── Problem 1: OpenAI API Key from Documentation ───────────────────────

const openai = new OpenAI({
  // AI copied this from OpenAI docs example
  apiKey: 'sk-proj-abc123exampledef456ghi789jkl012mno',
});

async function generateChatCompletion() {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Hello!' }],
  });
  return completion;
}

// ── Problem 2: GitHub Personal Access Token Placeholder ─────────────────

const octokit = new Octokit({
  // AI generated a token that looks real but is from examples
  auth: 'ghp_exampleToken1234567890abcdefghijklmnopqrstuvwxyz',
});

async function getRepo(owner: string, repo: string) {
  return octokit.rest.repos.get({ owner, repo });
}

// ── Problem 3: AWS Access Key from Tutorial ───────────────────────────

const aws = require('aws-sdk');
const s3 = new aws.S3({
  // AI used a key from AWS docs tutorial
  accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  region: 'us-east-1',
});

// ── Problem 4: JWT with Empty Secret (AI Forgot to Replace) ─────────────

const jwt = require('jsonwebtoken');

function signToken(payload: any) {
  // AI generated this but forgot to replace with real secret
  return jwt.sign(payload, '');
}

function verifyToken(token: string) {
  // Another example - hardcoded short secret from AI training data
  return jwt.verify(token, 'secret123');
}

// ── Problem 5: Sensitive Data Logging (Left in Production Code) ─────────

async function loginUser(username: string, password: string) {
  const user = await db.users.findOne({ username });

  // AI left debug logging in production code
  console.log('User login attempt:', { username, password, apiKey: process.env.API_KEY });

  if (user && await bcrypt.compare(password, user.passwordHash)) {
    console.log('User authenticated:', user);
    return generateToken(user);
  }

  throw new Error('Invalid credentials');
}

// ── Problem 6: TODO Comment for Security Check (Never Implemented) ──────

app.post('/admin/delete', async (req, res) => {
  // TODO: Add admin role check before allowing delete
  // AI generated this placeholder but never implemented the check
  await db.users.deleteById(req.body.userId);
  res.json({ success: true });
});

// ── Problem 7: Dynamic CORS Origin Reflection (Security Vulnerability) ───

const express = require('express');
const app = express();

app.use((req, res, next) => {
  // AI generated dynamic origin reflection - a security vulnerability
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  next();
});

// ── Problem 8: Placeholder Password in Config ───────────────────────────

const config = {
  database: {
    host: 'localhost',
    port: 5432,
    // AI used a placeholder value from config template
    password: 'example_password_change_me',
  },
  api: {
    // Another AI-generated placeholder
    secretKey: 'demo-secret-key-replace-in-production',
  },
};

export {
  generateChatCompletion,
  getRepo,
  s3,
  signToken,
  verifyToken,
  loginUser,
  app,
  config,
};
