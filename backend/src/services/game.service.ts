import { ERROR_CODES, SUCCESS_CODES } from "../constants";
import { IPlayer } from "../interfaces";
import { Game } from "../models";
import { ApiError, ApiResponse } from "../utils";

export class GameService {
  async getGame(id: string) {
    const data = await Game.findById(id)
    return new ApiResponse(SUCCESS_CODES.OK, data, "Game fetched successfully")
  }
  async getAllGames() {
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
            $first: ["$user.name"]
          }
        }
      }
    ]).sort({ createdAt: -1 })
    return new ApiResponse(SUCCESS_CODES.OK, data, "Games fetched successfully")
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
          currentPlayer.color,
          game.horizontal_array,
          game.vertical_array,
          game.diagonal_array,
          game.left_diagonal_row,
          game.left_diagonal_col,
          game.right_diagonal_row,
          game.right_diagonal_col
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
        if (game.scores[0].points == game.scores[1].points) {
          game.winningStatus = "game draw"
        } else {
          game.winningStatus = `${game.players[0].name} wins!`
        }
        await game.save();
        return new ApiResponse(SUCCESS_CODES.OK, game, "Game ends");
      }
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
  checkForLines(board: string[][], gridSize: number, color: string, horizontal: number[], vertical: number[], diagonal: number[], left_row: number[], left_col: number[], right_row: number[], right_col: number[]): number {
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
          } else {
            break;
          }
        }
        if (count === gridSize) {
          lines++
          vertical.push(col)
        }
      }
    }

    //check left diagonal
    if (!diagonal.includes(0)) {
      let count = 0
      for (let i = 0; i < gridSize; i++) {
        if (board[i][i] == color) {
          count++;
        } else {
          break;
        }
      }
      if (count == gridSize) {
        lines++
        diagonal.push(0)
      }
    }

    //check right diagonal
    if (!diagonal.includes(gridSize - 1)) {
      let count = 0
      for (let i = 0, j = gridSize - 1; i < gridSize; i++, j--) {
        if ((i + j == gridSize - 1) && board[i][j] == color) {
          count++;
        } else {
          break;
        }
      }
      if (count == gridSize) {
        lines++
        diagonal.push(gridSize - 1)
      }
    }

    //checking left short diagonals with cols
    for (let col = 1; col < gridSize - 1; col++) {
      if (!left_col.includes(col)) {
        let count = 0
        for (let i = 0, j = col; j <= gridSize - 1; i++, j++) {
          if (board[i][j] == color) {
            count++
          } else {
            break
          }
        }
        if (count == gridSize - col) {
          lines++
          left_col.push(col)
        }
      }
    }

    //checking left short diagonals with rows
    for (let row = 1; row < gridSize - 1; row++) {
      if (!left_row.includes(row)) {
        let count = 0
        for (let i = row, j = 0; i <= gridSize - 1; i++, j++) {
          if (board[i][j] == color) {
            count++
          } else {
            break
          }
        }
        if (count == gridSize - row) {
          lines++
          left_row.push(row)
        }
      }
    }

    //checking right short diagonals with cols
    for (let col = 1; col < gridSize - 1; col++) {
      if (!right_col.includes(col)) {
        let count = 0
        for (let i = 0, j = col; j >= 0; i++, j--) {
          if (board[i][j] == color) {
            count++
          } else {
            break
          }
        }
        if (count == col + 1) {
          lines++
          right_col.push(col)
        }
      }
    }


    //checking right short diagonals with rows
    for (let row = 1; row < gridSize - 1; row++) {
      if (!right_row.includes(row)) {
        let count = 0
        for (let i = row, j = gridSize - 1; i <= gridSize - 1; i++, j--) {
          if (board[i][j] == color) {
            count++
          } else {
            break
          }
        }
        if (count == gridSize - row) {
          lines++
          right_row.push(row)
        }
      }
    }


    return lines;
  }
}
