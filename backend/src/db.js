import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}

const client = new MongoClient(uri);

let db = null;

export async function connectDB() {
  if (!db) {
    await client.connect();

    db = client.db("test");

    console.log("✅ Connected to MongoDB");
  }

  return db;
}