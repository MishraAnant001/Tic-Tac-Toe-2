import { Request } from "express";

export interface IRequest extends Request{
    userid?:string;
    role?:string;
}// models.ts
export interface IUser{
  name: string;
  email: string;
  password: string;
  role?: string;
}
export interface IPlayer {
    name: string;   // Player's name
    color: string;  // Player's color
}

export interface IScore {
    player: string;   // Player's name
    points: number;   // Number of winning lines
    blocks: number;   // Number of blocks covered
    rank: number;     // Player's rank
}

export interface IGame {
  _id:string,
    gridSize: number;                // Size of the grid (NxN)
    players: IPlayer[];               // Array of players
    currentPlayerIndex: number;      // Index of the current player
    board: string[][];               // 2D array representing the game board
    scores: IScore[];                 // Array of scores for each player
    gameStatus: 'ongoing' | 'finished'; // Current status of the game
    user:string,
    createdAt:Date,
    winningStatus:string
}

export interface ICreateGameRequest {
    gridSize: number;   // Size of the grid (NxN)
    players: IPlayer[];  // Array of players with their names and colors
}

export interface IMakeMoveRequest {
    gameId: string; // The ID of the game where the move is made
    row: number;   // Row index for the move
    col: number;   // Column index for the move
}

export interface AddPlayersRequest {
    gameId: string; // The ID of the game to which players are being added
    players: IPlayer[]; // Array of players to be added
}
