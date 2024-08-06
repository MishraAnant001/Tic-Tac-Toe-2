"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const player_model_1 = require("./player.model");
const score_model_1 = require("./score.model");
const gameSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    gridSize: { type: Number, required: true },
    players: [player_model_1.playerSchema],
    currentPlayerIndex: { type: Number, default: 0 },
    board: [[{ type: String, default: "" }]],
    scores: [score_model_1.scoreSchema],
    gameStatus: {
        type: String,
        enum: ["ongoing", "finished"],
        default: "ongoing",
    },
    winningStatus: String,
    horizontal_array: (Array),
    vertical_array: (Array),
    diagonal_array: (Array),
    left_diagonal_row: (Array),
    left_diagonal_col: (Array),
    right_diagonal_row: (Array),
    right_diagonal_col: (Array),
}, {
    timestamps: true
});
exports.Game = mongoose_1.default.model("Game", gameSchema);
