"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const constants_1 = require("../constants");
const models_1 = require("../models");
const utils_1 = require("../utils");
class GameService {
    getGame(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield models_1.Game.findById(id);
            return new utils_1.ApiResponse(constants_1.SUCCESS_CODES.OK, data, "Game fetched successfully");
        });
    }
    getAllGames() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield models_1.Game.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $addFields: {
                        user: {
                            $first: ["$user.name"]
                        }
                    }
                }
            ]).sort({ createdAt: -1 });
            return new utils_1.ApiResponse(constants_1.SUCCESS_CODES.OK, data, "Games fetched successfully");
        });
    }
    createGame(userid, gridSize, players) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate input
            if (gridSize < 3 || !Number.isInteger(gridSize)) {
                throw new utils_1.ApiError(constants_1.ERROR_CODES.BAD_REQUEST, "Grid size must be at least 3 and an integer.");
            }
            if (!Array.isArray(players) || players.length < 1) {
                throw new utils_1.ApiError(constants_1.ERROR_CODES.BAD_REQUEST, "At least one player is required.");
            }
            // Initialize the game
            const board = Array(gridSize)
                .fill(null)
                .map(() => Array(gridSize).fill(""));
            const game = new models_1.Game({
                user: userid,
                gridSize,
                players,
                currentPlayerIndex: 0,
                board,
                scores: players.map((player) => ({
                    player: player.name,
                    points: 0,
                    blocks: 0,
                    rank: 0,
                })),
                gameStatus: "ongoing",
            });
            yield game.save();
            return new utils_1.ApiResponse(constants_1.SUCCESS_CODES.CREATED, game, "Game created successfully!");
        });
    }
    makeMove(gameid, row, col) {
        return __awaiter(this, void 0, void 0, function* () {
            if (row < 0 || col < 0) {
                throw new utils_1.ApiError(constants_1.ERROR_CODES.BAD_REQUEST, "Invalid move coordinates.");
            }
            const game = yield models_1.Game.findById(gameid);
            if (!game)
                throw new utils_1.ApiError(constants_1.ERROR_CODES.BAD_REQUEST, "Game not found");
            if (game.board[row][col] === "") {
                const currentPlayer = game.players[game.currentPlayerIndex];
                game.board[row][col] = currentPlayer.color;
                // Update score for the current player
                const score = game.scores.find((score) => score.player === currentPlayer.name);
                if (score) {
                    score.blocks += 1;
                    const lines = this.checkForLines(game.board, game.gridSize, currentPlayer.color, game.horizontal_array, game.vertical_array, game.diagonal_array, game.left_diagonal_row, game.left_diagonal_col, game.right_diagonal_row, game.right_diagonal_col);
                    score.points += lines;
                }
                // Update player ranks
                game.scores.sort((a, b) => b.points - a.points || b.blocks - a.blocks);
                game.scores.forEach((score, index) => {
                    score.rank = index + 1;
                });
                if (this.isBoardFull(game.board)) {
                    game.gameStatus = "finished";
                    if (game.scores[0].points == game.scores[1].points) {
                        game.winningStatus = "game draw";
                    }
                    else {
                        game.winningStatus = `${game.players[0].name} wins!`;
                    }
                    yield game.save();
                    return new utils_1.ApiResponse(constants_1.SUCCESS_CODES.OK, game, "Game ends");
                }
                game.currentPlayerIndex =
                    (game.currentPlayerIndex + 1) % game.players.length;
                yield game.save();
                return new utils_1.ApiResponse(constants_1.SUCCESS_CODES.OK, game, `Game to be continued...`);
            }
            else {
                throw new utils_1.ApiError(constants_1.ERROR_CODES.BAD_REQUEST, "Cell is already occupied.");
            }
        });
    }
    isBoardFull(board) {
        return board.every((row) => row.every((cell) => cell !== ""));
    }
    checkForLines(board, gridSize, color, horizontal, vertical, diagonal, left_row, left_col, right_row, right_col) {
        let lines = 0;
        // Check horizontal lines
        for (let row = 0; row < gridSize; row++) {
            if (!horizontal.includes(row)) {
                if (board[row].every(cell => cell === color)) {
                    lines++;
                    horizontal.push(row);
                }
            }
        }
        // Check vertical lines
        for (let col = 0; col < gridSize; col++) {
            if (!vertical.includes(col)) {
                let count = 0;
                for (let row = 0; row < gridSize; row++) {
                    if (board[row][col] === color) {
                        count++;
                    }
                    else {
                        break;
                    }
                }
                if (count === gridSize) {
                    lines++;
                    vertical.push(col);
                }
            }
        }
        //check left diagonal
        if (!diagonal.includes(0)) {
            let count = 0;
            for (let i = 0; i < gridSize; i++) {
                if (board[i][i] == color) {
                    count++;
                }
                else {
                    break;
                }
            }
            if (count == gridSize) {
                lines++;
                diagonal.push(0);
            }
        }
        //check right diagonal
        if (!diagonal.includes(gridSize - 1)) {
            let count = 0;
            for (let i = 0, j = gridSize - 1; i < gridSize; i++, j--) {
                if ((i + j == gridSize - 1) && board[i][j] == color) {
                    count++;
                }
                else {
                    break;
                }
            }
            if (count == gridSize) {
                lines++;
                diagonal.push(gridSize - 1);
            }
        }
        //checking left short diagonals with cols
        for (let col = 1; col < gridSize - 1; col++) {
            if (!left_col.includes(col)) {
                let count = 0;
                for (let i = 0, j = col; j <= gridSize - 1; i++, j++) {
                    if (board[i][j] == color) {
                        count++;
                    }
                    else {
                        break;
                    }
                }
                if (count == gridSize - col) {
                    lines++;
                    left_col.push(col);
                }
            }
        }
        //checking left short diagonals with rows
        for (let row = 1; row < gridSize - 1; row++) {
            if (!left_row.includes(row)) {
                let count = 0;
                for (let i = row, j = 0; i <= gridSize - 1; i++, j++) {
                    if (board[i][j] == color) {
                        count++;
                    }
                    else {
                        break;
                    }
                }
                if (count == gridSize - row) {
                    lines++;
                    left_row.push(row);
                }
            }
        }
        //checking right short diagonals with cols
        for (let col = 1; col < gridSize - 1; col++) {
            if (!right_col.includes(col)) {
                let count = 0;
                for (let i = 0, j = col; j >= 0; i++, j--) {
                    if (board[i][j] == color) {
                        count++;
                    }
                    else {
                        break;
                    }
                }
                if (count == col + 1) {
                    lines++;
                    right_col.push(col);
                }
            }
        }
        //checking right short diagonals with rows
        for (let row = 1; row < gridSize - 1; row++) {
            if (!right_row.includes(row)) {
                let count = 0;
                for (let i = row, j = gridSize - 1; i <= gridSize - 1; i++, j--) {
                    if (board[i][j] == color) {
                        count++;
                    }
                    else {
                        break;
                    }
                }
                if (count == gridSize - row) {
                    lines++;
                    right_row.push(row);
                }
            }
        }
        return lines;
    }
}
exports.GameService = GameService;
