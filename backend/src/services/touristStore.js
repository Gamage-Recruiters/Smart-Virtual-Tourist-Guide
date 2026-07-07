const crypto = require("crypto");
const User = require("../models/User");
const TouristProfile = require("../models/TouristProfile");

function publicUser(user) {
  if (!user) {
    return null;
  }

  const plainUser = typeof user.toObject === "function" ? user.toObject() : user;
  const { password, sessionToken, __v, ...safeUser } = plainUser;
  return safeUser;
}

function getUserId(user) {
  if (!user) {
    return null;
  }

  return String(user._id || user.id || "");
}

async function createUser({ fullName, email, password }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!fullName || !normalizedEmail || !password) {
    const error = new Error("fullName, email, and password are required.");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error("A user with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const sessionToken = crypto.randomUUID();
  const createdUser = await User.create({
    fullName: String(fullName).trim(),
    email: normalizedEmail,
    password,
    sessionToken,
  });

  return {
    token: sessionToken,
    user: publicUser(createdUser),
  };
}

async function getUserFromToken(token) {
  if (!token) {
    return null;
  }

  const user = await User.findOne({ sessionToken: token });
  const safeUser = publicUser(user);

  if (!safeUser) {
    return null;
  }

  return {
    ...safeUser,
    id: getUserId(user),
  };
}

async function saveTouristProfile({ userId, profile }) {
  const savedProfile = await TouristProfile.findOneAndUpdate(
    { userId },
    { $set: { userId, ...profile } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return savedProfile;
}

module.exports = {
  createUser,
  getUserFromToken,
  saveTouristProfile,
};