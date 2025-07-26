import mongoose, { Schema, Document } from "mongoose"


export interface CreditDocument extends Document {
   user_id: number; // Utilise un entier comme clé primaire
  credits: number;
}

const creditSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  credits: { type: Number, required: true },
});


export const Credit = mongoose.model("Credit", creditSchema);