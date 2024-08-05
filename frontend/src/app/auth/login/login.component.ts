import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, ElementRef,OnDestroy,OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { SharedService, StorageService, UserService } from 'src/app/core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{
  form!: FormGroup;
  auth: any;
  @ViewChild("btn") googlebtn!: ElementRef;
  submitted = false;
  authservice:any;
  state!:boolean ;

  constructor(
    private fb: FormBuilder,
    private service: UserService,
    private router: Router,
    private storageService: StorageService,
    private _toastService: ToastService,
    private authService: SocialAuthService
  ) { }
  ngOnDestroy(): void {
    window.location.reload()
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    });
    this.onGoogleLogin()
  }

  onGoogleLogin() {
    this.authservice=this.authService.authState.subscribe((user) => {
      if (user) {
        const newUser = {
          name: user.name,
          email: user.email,
          googleId: user.id
        };
        this.service.googleLogin(newUser).subscribe({
          next: (response: any) => {
            this.state = false
            this.storageService.clear();
            this.storageService.setAccessToken(response.body.data.accessToken, false);
            this.storageService.setRefreshToken(response.body.data.refreshToken);
            this.storageService.setRole(response.body.data.user.role);
            this.storageService.setName(response.body.data.user.name);
            if (this.storageService.getRole() === "admin") {
              this.router.navigateByUrl("admin");
            } else {
              this.router.navigateByUrl("game");
            }
          },
          error: (error: any) => {
            if ((error.message as string).includes("Unknown Error")) {
              this._toastService.error("Server not responding");
            } else {
              this._toastService.error(error.error.message);
            }
          }
        });
      }
    });
  }
  onLogout(){
    this.authservice.unsubscribe()
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const remember = this.form.controls['remember'].value;
      this.service.loginUser(this.form.value).subscribe({
        next: (response: any) => {
          this._toastService.success('User logged in successfully');
          this.storageService.clear();
          this.storageService.setAccessToken(response.body.data.accessToken, remember);
          this.storageService.setRefreshToken(response.body.data.refreshToken);
          this.storageService.setRole(response.body.data.user.role);
          this.storageService.setName(response.body.data.user.name);
          if (this.storageService.getRole() === "admin") {
            this.router.navigateByUrl("admin");
          } else {
            this.router.navigateByUrl("game");
          }
        },
        error: (error: any) => {
          if ((error.message as string).includes("Unknown Error")) {
            this._toastService.error("Server not responding");
          } else {
            this._toastService.error(error.error.message);
          }
        }
      });
    }
  }



  get f() {
    return this.form.controls;
  }
}
