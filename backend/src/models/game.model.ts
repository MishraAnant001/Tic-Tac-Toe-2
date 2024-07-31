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
    players: [playerSchema],
    currentPlayerIndex: { type: Number, default: 0 },
    board: [[{ type: String, default: "" }]],
    scores: [scoreSchema],
    gameStatus: {
      type: String,
      enum: ["ongoing", "finished"],
      default: "ongoing",
    },
    winningStatus:String,
    horizontal_array:Array<Number>,
    vertical_array:Array<Number>,
    diagonal_array:Array<Number>,
    left_diagonal_row:Array<Number>,
    left_diagonal_col:Array<Number>,
    right_diagonal_row:Array<Number>,
    right_diagonal_col:Array<Number>,
  },
  {
    timestamps: true
  }
);

export const Game = mongoose.model("Game", gameSchema);
