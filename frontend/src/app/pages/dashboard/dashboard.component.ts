import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { DashboardService, StorageService } from 'src/app/core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private service: DashboardService,private _toastService: ToastService,private storageservice:StorageService,private router:Router) {}

  data: any;

  options: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };

    this.service.getAdminData().subscribe({
      next: (response: any) => {
        console.log(response);
        const keys = Object.keys(response.data);
        const values = Object.values(response.data);
        console.log(keys);
        console.log(values);
        this.data = {
          labels: keys,
          datasets: [
            {
              data: values,
              backgroundColor: [
                documentStyle.getPropertyValue('--blue-500'),
                documentStyle.getPropertyValue('--yellow-500'),
                documentStyle.getPropertyValue('--green-500'),
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue('--blue-400'),
                documentStyle.getPropertyValue('--yellow-400'),
                documentStyle.getPropertyValue('--green-400'),
              ],
            },
          ],
        };
      },
      error: (error: any) => {

        if (error.error) {
          this._toastService.error(error.error.message);
        } else {
          this._toastService.error(error.message);
        }
        if(error.status==403 || error.status==401){
          this.storageservice.clear()
          this.router.navigateByUrl("/auth")
        }

      },
    });
  }
}
