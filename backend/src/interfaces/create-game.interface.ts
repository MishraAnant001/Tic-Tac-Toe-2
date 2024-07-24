import { IPlayer } from "./player.interface";

export interface ICreateGameRequest {
    gridSize: number;   // Size of the grid (NxN)
    players: IPlayer[];  // Array of players with their names and colors
}