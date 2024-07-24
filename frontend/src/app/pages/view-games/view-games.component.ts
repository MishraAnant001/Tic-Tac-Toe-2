import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/services';
import { IGame } from 'src/app/models';

@Component({
  selector: 'app-view-games',
  templateUrl: './view-games.component.html',
  styleUrls: ['./view-games.component.scss'],
})
export class ViewGamesComponent implements OnInit {
  gameData!: IGame[];
  game!: IGame;
  constructor(private service: GameService) {}
  ngOnInit(): void {
    this.getGames();
  }
  getGames() {
    this.service.getAllGames().subscribe({
      next: (response: any) => {
        this.gameData = response.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  onView(recievedGame: IGame) {
    // console.log(recievedGame)
    this.game = recievedGame;
  }
  getColor(playerName: string): string {
    const player = this.game?.players.find(p => p.name === playerName);
    return player ? player.color : '';
  }
}
