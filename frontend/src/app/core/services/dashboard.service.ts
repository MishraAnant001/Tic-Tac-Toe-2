import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private adminApi = "https://5cg4v22c-8000.inc1.devtunnels.ms/api/v1/dashboard/admin"
  constructor(private http:HttpClient) { }

  getAdminData(){
    return this.http.get(this.adminApi)
  }
}
