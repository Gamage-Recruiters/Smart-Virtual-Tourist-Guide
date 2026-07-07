const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.join(__dirname, "..", "data");
const STORE_FILE = path.join(DATA_DIR, "tourist-store.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(STORE_FILE);
  } catch {
    const initialState = {
      users: [],
      sessions: {},
      profiles: [],
    };
    await fs.writeFile(STORE_FILE, JSON.stringify(initialState, null, 2), "utf8");
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(STORE_FILE, "utf8");
  return JSON.parse(raw);
}

async function writeStore(store) {
  await ensureStore();
  await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}

function publicUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

async function createUser({ fullName, email, password }) {
  const store = await readStore();
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!fullName || !normalizedEmail || !password) {
    const error = new Error("fullName, email, and password are required.");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = store.users.find((user) => user.email === normalizedEmail);
  if (existingUser) {
    const error = new Error("A user with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const user = {
    id: crypto.randomUUID(),
    fullName: String(fullName).trim(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);

  const token = crypto.randomUUID();
  store.sessions[token] = user.id;

  await writeStore(store);

  return {
    token,
    user: publicUser(user),
  };
}

async function getUserFromToken(token) {
  if (!token) {
    return null;
  }

  const store = await readStore();
  const userId = store.sessions[token];
  if (!userId) {
    return null;
  }

  const user = store.users.find((entry) => entry.id === userId);
  return publicUser(user);
}

async function saveTouristProfile({ userId, profile }) {
  const store = await readStore();
  const existingIndex = store.profiles.findIndex((entry) => entry.userId === userId);
  const savedProfile = {
    id: existingIndex >= 0 ? store.profiles[existingIndex].id : crypto.randomUUID(),
    userId,
    ...profile,
    updatedAt: new Date().toISOString(),
    createdAt: existingIndex >= 0 ? store.profiles[existingIndex].createdAt : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    store.profiles[existingIndex] = savedProfile;
  } else {
    store.profiles.push(savedProfile);
  }

  await writeStore(store);
  return savedProfile;
}

module.exports = {
  createUser,
  getUserFromToken,
  saveTouristProfile,
};
