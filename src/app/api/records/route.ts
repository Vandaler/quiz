/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectToDatabase } from "@/app/lib/mongodb";
import Record from "@/app/models/Record";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectToDatabase();
  const records = await Record.find().populate('userId'); // ดึงข้อมูล record พร้อมข้อมูลผู้ใช้
  return NextResponse.json({ data: records });
}

export async function POST(req: Request) {
  const body = await req.json();
  await connectToDatabase();
  
  // ตรวจสอบว่ามี userId ใน body หรือไม่
  if (!body.userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const record = new Record(body);
  await record.save();
  
  return NextResponse.json({ message: "Record created successfully" });
}
