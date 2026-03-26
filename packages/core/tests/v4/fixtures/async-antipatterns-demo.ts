/**
 * Demo file: AI-Generated Async Anti-patterns
 *
 * This file contains real-world async anti-patterns commonly produced by AI.
 * Run with: npx open-code-review scan packages/core/tests/v4/fixtures/async-antipatterns-demo.ts
 */

// ── Pattern 1: async forEach (DOES NOT AWAIT) ───────────────────
// AI generates this constantly. forEach ignores the returned Promise.
// Result: items process in random order, errors are silently swallowed.

async function processOrders(orders: Order[]) {
  orders.forEach(async (order) => {
    await validateOrder(order);
    await chargePayment(order);
    await sendConfirmation(order);
  });
  // BUG: This line runs BEFORE any order is processed!
  console.log('All orders processed');
}

// ── Pattern 2: Promise constructor anti-pattern ──────────────────
// AI wraps async functions in new Promise() unnecessarily.
// Errors thrown after the first await are silently lost.

async function fetchUserData(userId: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.findUser(userId);
      const profile = await db.findProfile(user.profileId);
      resolve({ user, profile });
    } catch (err) {
      reject(err);
    }
  });
}

// ── Pattern 3: .then() without .catch() ──────────────────────────
// AI chains .then() but forgets .catch().
// In Node.js, unhandled rejections terminate the process.

function initializeApp() {
  loadConfig().then(config => {
    startServer(config);
  });

  connectDatabase().then(db => {
    runMigrations(db);
  });
}

// ── Pattern 4: Sequential awaits that could be parallel ──────────
// AI generates sequential awaits for independent API calls.
// This makes the function 3x slower than it needs to be.

async function loadDashboard(userId: string) {
  const profile = await fetchProfile(userId);
  const notifications = await fetchNotifications(userId);
  const recommendations = await fetchRecommendations(userId);

  // FIX: Use Promise.all for independent calls:
  // const [profile, notifications, recommendations] = await Promise.all([
  //   fetchProfile(userId),
  //   fetchNotifications(userId),
  //   fetchRecommendations(userId),
  // ]);

  return { profile, notifications, recommendations };
}

// ── Types (for TypeScript compilation) ───────────────────────────

interface Order {
  id: string;
  amount: number;
}

declare function validateOrder(order: Order): Promise<void>;
declare function chargePayment(order: Order): Promise<void>;
declare function sendConfirmation(order: Order): Promise<void>;
declare const db: { findUser: Function; findProfile: Function };
declare function loadConfig(): Promise<any>;
declare function startServer(config: any): void;
declare function connectDatabase(): Promise<any>;
declare function runMigrations(db: any): Promise<void>;
declare function fetchProfile(id: string): Promise<any>;
declare function fetchNotifications(id: string): Promise<any>;
declare function fetchRecommendations(id: string): Promise<any>;
