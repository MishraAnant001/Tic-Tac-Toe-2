import mongoose from "mongoose";

export const scoreSchema = new mongoose.Schema({
    player: { type: String, required: true },
    points: { type: Number, default: 0 },
    blocks: { type: Number, default: 0 },
    rank: { type: Number, default: 0 }
});

export const Score = mongoose.model('Score', scoreSchema);