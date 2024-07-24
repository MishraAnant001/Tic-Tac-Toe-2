import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ConfirmationService } from 'primeng/api';
import { GameService, StorageService } from 'src/app/core/services';
import { ICreateGameRequest, IGame, IMakeMoveRequest } from 'src/app/models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  gridSize!: number;
  isEnded = false;
  numberOfPlayers!: number;
  players: { name: string; color: string }[] = [];
  game: IGame | null = null;
  currentPlayerIndex: number = 0;
  row: number | null = null;
  col: number | null = null;

  constructor(
    private gameService: GameService,
    private router: Router,
    private service: StorageService,
    private confirmationService: ConfirmationService,
    private _toastService: ToastService
  ) {}

  initializeGame() {
    if (this.gridSize < 3 || this.numberOfPlayers < 2) {
      this._toastService.error(
        'Grid size must be at least 3x3 and there must be at least 2 players.'
      );
      return;
    }

    this.players = Array.from({ length: this.numberOfPlayers }, () => ({
      name: '',
      color: '',
    }));
    this.game = null;
  }
  user = this.service.getName();
  logout() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._toastService.success('user logged out successfully');
        this.service.clear();
        this.router.navigateByUrl('/auth');
      },
    });
  }
  // Create the game
  createGame() {
    const request: ICreateGameRequest = {
      gridSize: this.gridSize,
      players: this.players,
    };
    // console.log(request)

    this.gameService.createGame(request).subscribe({
      next: (response) => {
        // console.log(response);
        this._toastService.success('Game created successdully');

        this.game = response.data;
        this.currentPlayerIndex = this.game!.currentPlayerIndex!;
      },
      error: (error) => {
        if (error.error) {
          this._toastService.error(error.error.message);
        } else {
          this._toastService.error(error.message);
        }
      },
    });
  }
  getColor(playerName: string): string {
    const player = this.game?.players.find((p) => p.name === playerName);
    return player ? player.color : '';
  }
  reload() {
    window.location.reload();
  }
  // Make a move
  makeMove(r: number, c: number) {
    this.row = r;
    this.col = c;
    if (this.row == null || this.col == null || this.game == null) {
      this._toastService.error(
        'Invalid move coordinates or game not initialized.'
      );
      return;
    }

    const request: IMakeMoveRequest = {
      gameId: this.game._id,
      row: this.row,
      col: this.col,
    };

    this.gameService.makeMove(request).subscribe({
      next: (response) => {
        // console.log(response);
        if (response.message == 'Game ends') {
          this._toastService.success('Game Ends');
          this.isEnded = true;
        }
        this.game = response.data;
        this.currentPlayerIndex = this.game!.currentPlayerIndex!;
      },
      error: (error) => {
        if (error.error) {
          this._toastService.error(error.error.message);
        } else {
          this._toastService.error(error.message);
        }
      },
    });
  }
}
