import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Dashboard1Component } from './views/dashboards/dashboard1/dashboard1.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { GroupsComponent } from './components/groups/groups.component';
import { StatsComponent } from './components/stats/stats.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { ReminderComponent } from './components/reminder/reminder.component';
import { LoggedinGuard } from './auth/loggedin.guard';
import { UsersManagementComponent } from './components/users-management/users-management.component';
import { ProfileComponent } from './components/profile/profile.component';
import { Configuration } from './config/environment';
import { GroupDetailsComponent } from './components/groups/group-details/group-details.component';
import { GroupListComponent } from './components/groups/group-list/group-list.component';
import { ExportComponent } from './components/export/export.component';
import { LogoutPageComponent } from './components/logout-page/logout-page.component';
import { SupplierUploadPageComponent } from './components/supplier-upload-page/supplier-upload-page.component';

const routes: Routes = [
  { path: 'upload', component: SupplierUploadPageComponent },
  { path: 'login', component: LoginPageComponent, canActivate: [LoggedinGuard] },
  { path: 'logout', component: LogoutPageComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [LoggedinGuard],  data: { roles: Configuration.basicRoutesRoles },
    children: [
      { path: 'main', component: Dashboard1Component },
      { path: 'supplier', component: SupplierComponent },
      { path: 'groups', component: GroupsComponent, children: [
        {path: '', component: GroupListComponent, },
        {path: 'details/:id', component: GroupDetailsComponent, },
      ] },
      { path: 'stats', component: StatsComponent },
      { path: 'alerts', component: AlertsComponent },
      { path: 'reminder', component: ReminderComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'export', component: ExportComponent },
      { path: 'users', component: UsersManagementComponent },
      { path: '', pathMatch: 'full', redirectTo: 'main'},
    ]
  },
  { path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      // { enableTracing: true }, // <-- debugging purposes only
      {
        onSameUrlNavigation: 'reload'
      },
    )
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
