import {
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
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
export class GameComponent implements OnInit {
  gridSize: number = 0;
  isEnded = false;
  error = false;
  numberOfPlayers: number = 0;
  players: { name: string; color: string }[] = [];
  game?: IGame;
  currentPlayerIndex: number = 0;
  row: number | null = null;
  col: number | null = null;
  most!: number;
  winner = '';

  constructor(
    private gameService: GameService,
    private router: Router,
    private service: StorageService,
    private confirmationService: ConfirmationService,
    private _toastService: ToastService,
    private authService: SocialAuthService
  ) { }
  ngOnInit(): void {
    const data = sessionStorage.getItem('game');
    if (data) {
      this.game = JSON.parse(data);
    }
  }
  initializeGame() {
    
    if (
      this.gridSize < 3 ||
      this.gridSize > 25 ||
      this.numberOfPlayers < 2 ||
      this.numberOfPlayers > Math.floor((this.gridSize * this.gridSize) / 2)
    ) {
      this.error = true;
      if (this.gridSize > 25) {
        this.most = 312;
      } else if (this.gridSize < 3) {
        this.most = 2;
      } else {
        this.most = Math.floor((this.gridSize * this.gridSize) / 2);
      }

      this.players = [];
      return;
    }
    this.error = false;

    this.players = Array.from({ length: this.numberOfPlayers }, () => ({
      name: '',
      color: '',
    }));
    this.game = undefined;
  }
  user = this.service.getName();
  logout() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService
          .signOut(true)
          .then((res) => {
            this._toastService.success('user logged out successfully');
            this.service.clear();
            this.router.navigateByUrl('/auth');
          })
          .catch((err) => {
            this._toastService.success('user logged out successfully');
            this.service.clear();
            this.router.navigateByUrl('/auth');
          });
      },
    });
  }
  // Create the game
  createGame() {
    let names: string[] = [];
    let colors: string[] = [];
    let count = 1;
    for (let player of this.players) {
      if (player.name == '' || player.color == '') {
        this._toastService.error(`Please fill all details of player ${count}`);
        return;
      }
      count++;
      names.push(player.name);
      colors.push(player.color);
      if (names.filter((name) => name === player.name).length > 1) {
        this._toastService.error("player's name cannot be same!");
        return;
      }
      if (colors.filter((color) => color === player.color).length > 1) {
        this._toastService.error("player's color cannot be same!");
        return;
      }
    }

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
        sessionStorage.setItem('game', JSON.stringify(response.data));
        this.currentPlayerIndex = this.game!.currentPlayerIndex!;
      },
      error: (error) => {
        if (error.error) {
          this._toastService.dismissAll();
          if (
            (error.error.message as string).indexOf('refresh token expired') >
            -1
          ) {
            this._toastService.error('Session expired ! Kindly login again');
          } else {
            this._toastService.error(error.error.message);
          }
        } else {
          this._toastService.dismissAll();
          if (
            (error.message as string).indexOf('No refresh token available') > -1
          ) {
            this._toastService.error('Session expired ! Kindly login again');
          } else {
            this._toastService.error(error.message);
          }
        }
      },
    });
  }
  getColor(playerName: string): string {
    const player = this.game?.players.find((p) => p.name === playerName);
    return player ? player.color : '';
  }
  reload() {
    // window.location.reload();
    this.game = undefined;
    this.gridSize = 0;
    this.numberOfPlayers = 0;
    this.players = [];
    this.isEnded = false;
    sessionStorage.removeItem('game');
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
          this.winner = response.data.winningStatus;
          this.isEnded = true;
        }
        this.game = response.data;
        sessionStorage.setItem('game', JSON.stringify(response.data));
        this.currentPlayerIndex = this.game!.currentPlayerIndex!;
      },
      error: (error) => {
        if (error.error) {
          this._toastService.dismissAll();
          if (
            (error.error.message as string).indexOf('refresh token expired') >
            -1
          ) {
            this._toastService.error('Session expired ! Kindly login again');
          } else {
            this._toastService.error(error.error.message);
          }
        } else {
          this._toastService.dismissAll();
          if (
            (error.message as string).indexOf('No refresh token available') > -1
          ) {
            this._toastService.error('Session expired ! Kindly login again');
          } else {
            this._toastService.error(error.message);
          }
        }
      },
    });
  }
}
