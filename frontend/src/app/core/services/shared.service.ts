import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private isLoggedIn = new BehaviorSubject<boolean>(false)
  constructor() { }
  getLogInfo(){
    return this.isLoggedIn.asObservable()
  }
  setLogInfo(){
    this.isLoggedIn.next(true)
  }
}
