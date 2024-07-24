// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { DisplayComponent } from './layouts/display/display.component';
import { authGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { loginGuard } from './core/guards/login.guard';

const routes: Routes = [
  {
    path:"",
    redirectTo:"auth",
    pathMatch:"full"
  },
  { path: 'game', component: GameComponent, canActivate:[authGuard] },
  {
    path:"admin",
    component:DisplayComponent,
    loadChildren:()=>import("./pages/pages.module").then((m)=>m.PagesModule),
    canActivate:[authGuard]

  },
  {
    path:"auth",
    component:AuthLayoutComponent,
    loadChildren:()=> import("./auth/auth.module").then((m)=>m.AuthModule),
    canActivate:[loginGuard]
  },
  {
    path: '**',
    redirectTo:"auth",
    pathMatch:"full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
