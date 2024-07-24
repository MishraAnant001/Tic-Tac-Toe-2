import { ERROR_CODES, SUCCESS_CODES } from "../constants";
import { IPlayer } from "../interfaces";
import { Game } from "../models";
import { ApiError, ApiResponse } from "../utils";

export class GameService {

  async getAllGames(){
    const data = await Game.aggregate([
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
            $first:["$user.name"]
          }
        }
      }
    ]).sort({createdAt:-1})
    return new ApiResponse(SUCCESS_CODES.OK,data,"Games fetched successfully")
  }
  async createGame(userid: string, gridSize: number, players: IPlayer[]) {
    // Validate input
    if (gridSize < 3 || !Number.isInteger(gridSize)) {
      throw new ApiError(
        ERROR_CODES.BAD_REQUEST,
        "Grid size must be at least 3 and an integer."
      );
    }
    if (!Array.isArray(players) || players.length < 1) {
      throw new ApiError(
        ERROR_CODES.BAD_REQUEST,
        "At least one player is required."
      );
    }
    // Initialize the game
    const board = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(""));
    const game = new Game({
      user: userid,
      gridSize,
      players,
      currentPlayerIndex: 0,
      board,
      scores: players.map((player: any) => ({
        player: player.name,
        points: 0,
        blocks: 0,
        rank: 0,
      })),
      gameStatus: "ongoing",
    });

    await game.save();
    return new ApiResponse(
      SUCCESS_CODES.CREATED,
      game,
      "Game created successfully!"
    );
  }

  async makeMove(gameid: string, row: number, col: number) {
    if (row < 0 || col < 0) {
      throw new ApiError(ERROR_CODES.BAD_REQUEST, "Invalid move coordinates.");
    }

    const game: any = await Game.findById(gameid);
    if (!game) throw new ApiError(ERROR_CODES.BAD_REQUEST, "Game not found");

    if (game.board[row][col] === "") {
      const currentPlayer = game.players[game.currentPlayerIndex];
      game.board[row][col] = currentPlayer.color;

      // Update score for the current player
      const score = game.scores.find(
        (score: any) => score.player === currentPlayer.name
      );
      if (score) {
        score.blocks += 1;
        const lines = this.checkForLines(
          game.board,
          game.gridSize,
          currentPlayer.color
        );
        score.points += lines;
      }

      // Update player ranks
      game.scores.sort(
        (a: any, b: any) => b.points - a.points || b.blocks - a.blocks
      );
      game.scores.forEach((score: any, index: number) => {
        score.rank = index + 1;
      });
      if (this.isBoardFull(game.board)) {
        game.gameStatus = "finished";
        await game.save();
        return new ApiResponse(SUCCESS_CODES.OK, game, "Game ends");
      }
      // Check if the current player has won
      // const winningLines = this.checkForLines(game.board, game.gridSize, currentPlayer.color);

      // if (winningLines > 0) {
      //     // Current player wins
      //     game.gameStatus = 'finished';
      //     await game.save();
      //    return new ApiResponse(SUCCESS_CODES.OK,game,`Player ${currentPlayer.name} wins!`)
      // } else if (this.isBoardFull(game.board)) {
      //     // The game is a draw
      //     game.gameStatus = 'finished';
      //     await game.save();
      //     return new ApiResponse(SUCCESS_CODES.OK,game, 'The game is a draw!')
      // }

      // Move to the next player
      game.currentPlayerIndex =
        (game.currentPlayerIndex + 1) % game.players.length;

      await game.save();
      return new ApiResponse(SUCCESS_CODES.OK, game, `Game to be continued...`);
    } else {
      throw new ApiError(ERROR_CODES.BAD_REQUEST, "Cell is already occupied.");
    }
  }
  isBoardFull(board: string[][]): boolean {
    return board.every((row) => row.every((cell) => cell !== ""));
  }
  checkForLines(board: string[][], gridSize: number, color: string): number {
    let lines = 0;

    // Check horizontal lines
    for (let row = 0; row < gridSize; row++) {
      let count = 0;
      for (let col = 0; col < gridSize; col++) {
        if (board[row][col] === color) {
          count++;
        } else {
          break;
        }
      }
      if (count === gridSize) lines++;
    }

    // Check vertical lines
    for (let col = 0; col < gridSize; col++) {
      let count = 0;
      for (let row = 0; row < gridSize; row++) {
        if (board[row][col] === color) {
          count++;
        } else {
          break;
        }
      }
      if (count === gridSize) lines++;
    }

    // Check diagonal lines (top-left to bottom-right)
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        let count = 0;
        for (let i = 0; i < gridSize; i++) {
          if (
            row + i < gridSize &&
            col + i < gridSize &&
            board[row + i][col + i] === color
          ) {
            count++;
          } else {
            break;
          }
        }
        if (count === gridSize) lines++;
      }
    }

    // Check diagonal lines (top-right to bottom-left)
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        let count = 0;
        for (let i = 0; i < gridSize; i++) {
          if (
            row + i < gridSize &&
            col - i >= 0 &&
            board[row + i][col - i] === color
          ) {
            count++;
          } else {
            break;
          }
        }
        if (count === gridSize) lines++;
      }
    }

    return lines;
  }
}
