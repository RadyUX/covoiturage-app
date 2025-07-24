import mongoose from "mongoose";

const creditSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true }, // id MySQL
  credits: { type: Number, default: 0 }
});

export const Credit = mongoose.model("Credit", creditSchema);