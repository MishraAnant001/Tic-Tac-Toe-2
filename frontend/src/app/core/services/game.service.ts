// src/app/services/game.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICreateGameRequest, IMakeMoveRequest } from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = 'http://192.168.4.5:8000/api/v1/game/';
  constructor(private http: HttpClient) {}
  createGame(data: ICreateGameRequest): Observable<any> {
    return this.http.post(this.apiUrl + 'create', data);
  }

  makeMove(data: IMakeMoveRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}make-move`, data);
  }

  getAllGames() {
    return this.http.get(this.apiUrl);
  }
}
