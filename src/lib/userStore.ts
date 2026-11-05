import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
}

export interface VerificationCode {
  email: string;
  code: string;
  type: 'signup' | 'reset-password';
  expiresAt: number; // timestamp ms
  createdAt: number;
}

interface UserDatabase {
  users: User[];
  codes: VerificationCode[];
}

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'users.json');
const AUTH_SECRET = process.env.AUTH_SECRET || 'justspik_super_secret_auth_key_2026';

// Assure l'existence du fichier users.json
async function loadDb(): Promise<UserDatabase> {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      codes: Array.isArray(parsed.codes) ? parsed.codes : [],
    };
  } catch {
    const initial: UserDatabase = { users: [], codes: [] };
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    } catch {
      // Ignoré si dossier inexistant lors du premier run
    }
    return initial;
  }
}

async function saveDb(db: UserDatabase): Promise<void> {
  // Supprime les codes expirés depuis plus d'une heure pour garder le fichier propre
  const now = Date.now();
  db.codes = db.codes.filter((c) => c.expiresAt > now - 3600 * 1000);
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

// Sécurité mot de passe (Node.js crypto scrypt)
export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    hash: derivedKey.toString('hex'),
    salt,
  };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    return crypto.timingSafeEqual(keyBuffer, hashBuffer);
  } catch {
    return false;
  }
}

// Génère un code à 6 chiffres
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Création / Gestion session avec token signé
export function createSessionToken(userId: string): string {
  const expiresAt = Date.now() + 30 * 24 * 3600 * 1000; // 30 jours
  const payload = `${userId}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

export function verifySessionToken(token: string): { userId: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const [userId, expiresAtStr, signature] = decoded.split(':');
    if (!userId || !expiresAtStr || !signature) return null;

    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) return null;

    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(`${userId}:${expiresAtStr}`)
      .digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return { userId };
    }
    return null;
  } catch {
    return null;
  }
}

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

// Opérations Utilisateurs
export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await loadDb();
  const normalized = email.toLowerCase().trim();
  return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export async function findUserById(id: string): Promise<User | null> {
  const db = await loadDb();
  return db.users.find((u) => u.id === id) || null;
}

export async function createUser(params: {
  email: string;
  name: string;
  password: string;
  isVerified?: boolean;
}): Promise<User> {
  const db = await loadDb();
  const normalized = params.email.toLowerCase().trim();

  const { hash, salt } = hashPassword(params.password);
  const newUser: User = {
    id: crypto.randomUUID(),
    email: normalized,
    name: params.name.trim(),
    passwordHash: hash,
    salt,
    isVerified: params.isVerified ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  await saveDb(db);
  return newUser;
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<User | null> {
  const db = await loadDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  db.users[index] = {
    ...db.users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await saveDb(db);
  return db.users[index];
}

// Opérations Codes OTP
export async function storeVerificationCode(
  email: string,
  type: 'signup' | 'reset-password'
): Promise<string> {
  const db = await loadDb();
  const normalized = email.toLowerCase().trim();
  const code = generateOtpCode();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  // Supprime les anciens codes actifs pour cet email et ce type
  db.codes = db.codes.filter(
    (c) => !(c.email.toLowerCase() === normalized && c.type === type)
  );

  db.codes.push({
    email: normalized,
    code,
    type,
    expiresAt,
    createdAt: Date.now(),
  });

  await saveDb(db);
  return code;
}

export async function verifyOtpCode(
  email: string,
  code: string,
  type: 'signup' | 'reset-password'
): Promise<boolean> {
  const db = await loadDb();
  const normalized = email.toLowerCase().trim();
  const trimmedCode = code.trim();

  const foundIndex = db.codes.findIndex(
    (c) =>
      c.email.toLowerCase() === normalized &&
      c.code === trimmedCode &&
      c.type === type &&
      c.expiresAt > Date.now()
  );

  if (foundIndex === -1) {
    return false;
  }

  // Code valide : on le consomme (suppression)
  db.codes.splice(foundIndex, 1);
  await saveDb(db);
  return true;
}
