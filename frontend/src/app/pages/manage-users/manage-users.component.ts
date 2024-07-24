import { Component } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { ConfirmationService } from 'primeng/api';
import { UserService } from 'src/app/core/services';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent {
  constructor(
    private service: UserService,
    private _toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {}
  userData!: any[];
  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.service.getAllUsers().subscribe({
      next: (response: any) => {
        // console.log(response);
        this.userData = response.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  onDelete(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.deleteUser(user._id).subscribe({
          next: (response) => {
            this._toastService.success('User deleted successfully');
            this.getUsers();
          },
          error: (error: any) => {
            if (error.error) {
              this._toastService.error(error.error.message);
            } else {
              this._toastService.error(error.message);
            }
          },
        });
      },
    });
  }
}
