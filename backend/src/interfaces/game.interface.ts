import { IPlayer } from "./player.interface";
import { IScore } from "./score.interface";

export interface IGame {
    gridSize: number;                // Size of the grid (NxN)
    players: IPlayer[];               // Array of players
    currentPlayerIndex: number;      // Index of the current player
    board: string[][];               // 2D array representing the game board
    scores: IScore[];                 // Array of scores for each player
    gameStatus: 'ongoing' | 'finished'; // Current status of the game
}