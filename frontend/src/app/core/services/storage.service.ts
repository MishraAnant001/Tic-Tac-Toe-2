import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setAccessToken(token:string,remember:boolean){
    if(!remember){
      sessionStorage.setItem("accessToken",token)
    }else{
      localStorage.setItem("accessToken",token)
    }
  }
  setRefreshToken(token:string){
      localStorage.setItem("refreshToken",token)
  }
  getRefreshToken(){
    return localStorage.getItem('refreshToken')
  }
  getAccessToken(){
    return sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken")
  }

  setRole(role:string){
    localStorage.setItem("role",role)
  }

  getRole(){
    return localStorage.getItem("role")
  }

  setName(name:string){
    localStorage.setItem("name",name)
  }

  getName(){
    return localStorage.getItem("name")
  }

  clear(){
    sessionStorage.clear()
    localStorage.clear()
  }
}
