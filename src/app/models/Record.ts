import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  amount: { type: String, required: true },
  duedate: { type: String, required: true },
  select: { type: String, required: true }, // income or expense
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // reference to User
});

const Record = mongoose.models.Record || mongoose.model("Record", recordSchema);

export default Record;
