import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services';
import { Location } from '@angular/common';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const service = inject(StorageService)
  const location = inject(Location)
  if(service.getAccessToken()){
    const role = service.getRole();
    if(role === "user"){
      router.navigate(["/game"])
    }else{
      router.navigate(["/admin"])
    }
    return false;
  }else{
    return true;
  }
};
