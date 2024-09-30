import mongoose from "mongoose";

const uri = process.env.MONGODB_URI; // ใส่ URI ของ MongoDB ของคุณที่นี่

let cachedDb: mongoose.Connection | null = null;

export async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  if (uri) {
    const opts = { dbName: "record-income-ex" };
    const conn = await mongoose.connect(uri, opts);
    cachedDb = conn.connection;
    return cachedDb;
  }
  throw new Error("No MongoDB URI provided");
}
