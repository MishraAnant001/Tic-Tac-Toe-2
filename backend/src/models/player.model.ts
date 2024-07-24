import mongoose from "mongoose";

export const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String, required: true }
});

export const Player = mongoose.model('Player', playerSchema);