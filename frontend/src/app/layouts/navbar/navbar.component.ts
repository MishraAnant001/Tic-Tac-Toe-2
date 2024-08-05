import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ConfirmationService } from 'primeng/api';
import { SharedService, StorageService } from 'src/app/core/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private router: Router, private service: StorageService, private confirmationService: ConfirmationService, private _toastService: ToastService,private sharedService:SharedService,private authService: SocialAuthService) { }
  user = this.service.getName()
  logout() {
    window.location.reload()
    this.confirmationService.confirm({
      message: 'Are you sure that you want to logout?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._toastService.success("user logged out successfully");
        this.service.clear();
        this.router.navigateByUrl("/auth")
      }
    });
  }
}
