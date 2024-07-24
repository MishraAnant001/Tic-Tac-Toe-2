import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ViewGamesComponent } from './view-games/view-games.component';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [DashboardComponent, ManageUsersComponent, ViewGamesComponent],
  imports: [CommonModule, PagesRoutingModule, TableModule,ChartModule],
})
export class PagesModule {}
