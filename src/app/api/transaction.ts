/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectToDatabase } from "@/app/lib/mongodb";
import Record from "@/app/models/Record"; // ใช้โมเดล Record แทน
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const records = await Record.find(); // ดึงข้อมูลทั้งหมด
      return res.status(200).json({ data: records });
    } catch (err) {
      return res.status(500).json({ error: err }); // ใช้ err.message แทน
    }
  } else if (req.method === "POST") {
    try {
      const body = req.body; // ตรวจสอบว่าข้อมูลที่ส่งมาถูกต้องหรือไม่
      const newRecord = await Record.create(body); // สร้างเอกสารใหม่
      return res.status(201).json({ data: newRecord });
    } catch (err) {
      return res.status(500).json({ error: err }); // ใช้ err.message แทน
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" }); // แจ้งว่าเมธอดไม่ได้รับอนุญาต
  }
}
