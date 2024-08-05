import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private signupApi = "http://192.168.4.5:8000/api/v1/user/signup"
  private loginApi = "http://192.168.4.5:8000/api/v1/user/login"
  private getApi = "http://192.168.4.5:8000/api/v1/user/"
  constructor(private http: HttpClient) { }

  signupUser(data: IUser) {
    return this.http.post(this.signupApi, data, { observe: "response" })
  }
  loginUser(data: { email: string, password: string, remember: boolean }) {
    return this.http.post(this.loginApi, data, { observe: "response" })
  }
  socialLogin(data: {
    name: string,
    email: string,
    socialLoginId: string,
    socialLoginProvider: string,
  }) {
    return this.http.post(this.loginApi + "/social", data, { observe: "response" })
  }
  getAllUsers() {
    return this.http.get(this.getApi)
  }
  deleteUser(id: string) {
    return this.http.delete(this.getApi + id)
  }
  refreshAccessToken(token: string) {
    return this.http.post(this.getApi + "generate-token", { refreshToken: token })
  }
}
