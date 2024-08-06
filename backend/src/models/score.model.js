"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Score = exports.scoreSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.scoreSchema = new mongoose_1.default.Schema({
    player: { type: String, required: true },
    points: { type: Number, default: 0 },
    blocks: { type: Number, default: 0 },
    rank: { type: Number, default: 0 }
});
exports.Score = mongoose_1.default.model('Score', exports.scoreSchema);
