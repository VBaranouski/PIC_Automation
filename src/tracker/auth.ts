/**
 * Test Scenario Tracker — Authentication Layer
 *
 * User management helpers for the Tracker Web UI.
 * All user records are stored in the shared scenarios.db SQLite database.
 * Passwords are hashed with bcryptjs (pure JS, no native build required).
 *
 * Usage:
 *   import { createUser, verifyPassword, seedAdminIfNone } from '@tracker/auth';
 */

import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { getDb } from './db';

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  username: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
}

export interface PublicUser {
  id: string;
  username: string;
  role: UserRole;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const SALT_ROUNDS = 12;

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function createUser(username: string, password: string, role: UserRole = 'admin'): Promise<PublicUser> {
  const db = getDb();
  const id = randomUUID();
  const password_hash = await hashPassword(password);
  db.prepare(
    'INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run(id, username.trim().toLowerCase(), password_hash, role);
  const created_at = (db.prepare('SELECT created_at FROM users WHERE id = ?').get(id) as { created_at: string }).created_at;
  return { id, username: username.trim().toLowerCase(), role, created_at };
}

export function getUserByUsername(username: string): User | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim().toLowerCase()) as User | undefined;
}

export function getUserById(id: string): User | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
}

export function listUsers(): PublicUser[] {
  const db = getDb();
  return db.prepare('SELECT id, username, role, created_at FROM users ORDER BY created_at ASC').all() as PublicUser[];
}

export function userCount(): number {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  return row.count;
}

export function deleteUser(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return result.changes > 0;
}

// ── Seed ─────────────────────────────────────────────────────────────────────

/**
 * Seeds the default admin user from environment variables if no users exist yet.
 * Called once at server startup.
 *
 * Required env vars (when no users exist):
 *   TRACKER_ADMIN_USER     — admin username
 *   TRACKER_ADMIN_PASSWORD — admin password
 */
export async function seedAdminIfNone(): Promise<void> {
  if (userCount() > 0) return;

  const username = process.env.TRACKER_ADMIN_USER;
  const password = process.env.TRACKER_ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error(
      '[Tracker Auth] No users in DB and TRACKER_ADMIN_USER / TRACKER_ADMIN_PASSWORD are not set. ' +
      'Set them in your .env file to create the initial admin account.'
    );
  }

  await createUser(username, password, 'admin');
  console.log(`[Tracker Auth] Seeded initial admin user: "${username}"`);
}
