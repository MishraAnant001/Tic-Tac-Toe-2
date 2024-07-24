import mongoose from "mongoose";
import { playerSchema } from "./player.model";
import { scoreSchema } from "./score.model";

const gameSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gridSize: { type: Number, required: true },
    players: [playerSchema], // Array of Player sub-documents
    currentPlayerIndex: { type: Number, default: 0 },
    board: [[{ type: String, default: "" }]], // NxN grid
    scores: [scoreSchema], // Array of Score sub-documents
    gameStatus: {
      type: String,
      enum: ["ongoing", "finished"],
      default: "ongoing",
    },
  },
  {
    timestamps: true,
  }
);

export const Game = mongoose.model("Game", gameSchema);
