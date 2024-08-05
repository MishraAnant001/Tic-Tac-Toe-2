import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { StorageService, UserService } from '../services';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private storageService: StorageService, private userService: UserService, private router: Router, private _toastService: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if ((error.error.message as string).indexOf("access token expired")>-1) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = this.storageService.getRefreshToken();
    
    if (!refreshToken) {
      this.storageService.clear();
      this.router.navigateByUrl("/auth");
      return throwError(() => new Error('No refresh token available'));
    }

    return this.userService.refreshAccessToken(refreshToken).pipe(
      switchMap((response: any) => {
        const accessToken = response.data;
        this.storageService.setAccessToken(accessToken, false);
        
        const authReq = request.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` }
        });

        return next.handle(authReq);
      }),
      catchError((error) => {
        this.storageService.clear();
        this.router.navigateByUrl("/auth");
        return throwError(() => error);
      })
    );
  }
}
