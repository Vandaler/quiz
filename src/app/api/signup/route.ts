import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function POST(req: Request) {
  const body = await req.json();
  await connectToDatabase();

  // ตรวจสอบว่า username มีอยู่ในฐานข้อมูลหรือไม่
  const existingUser = await User.findOne({ username: body.username });
  if (existingUser) {
    return NextResponse.json({ message: "Username already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);
  const user = new User({
    username: body.username,
    password: hashedPassword,
  });

  await user.save();

  return NextResponse.json({ message: "User registered successfully" });
}
