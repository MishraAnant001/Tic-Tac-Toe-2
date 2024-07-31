import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private adminApi = "http://192.168.4.5:8000/api/v1/dashboard/admin"
  constructor(private http:HttpClient) { }

  getAdminData(){
    return this.http.get(this.adminApi)
  }
}
