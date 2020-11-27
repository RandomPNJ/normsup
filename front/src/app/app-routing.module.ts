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
import { SupplierUploadSuccessComponent } from './components/supplier-upload-page/supplier-upload-success/supplier-upload-success.component';
import { SupplierUploadInterfaceComponent } from './components/supplier-upload-page/supplier-upload-interface/supplier-upload-interface.component';
import { BackofficeComponent } from './components/backoffice/backoffice.component';
import { BackofficeGuard } from './auth/backoffice.guard';
import { BackofficeUsersComponent } from './components/backoffice-users/backoffice-users.component';
import { SupplierLoginPageComponent } from './components/supplier-login-page/supplier-login-page.component';
import { BackofficeSuppliersComponent } from './components/backoffice-suppliers/backoffice-suppliers.component';
import { GuestGuard } from './auth/guest.guard';
import { BackofficeClientComponent } from './components/backoffice-client/backoffice-client.component';
import { AdminLoginPageComponent } from './components/admin-login-page/admin-login-page.component';
import { ActivationLinkComponent } from './components/activation-link/activation-link.component';
import { GenerateActivationLinkComponent } from './components/generate-activation-link/generate-activation-link.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import {DashboardSupplierComponent} from './components/supplier/dashboard-supplier/dashboard-supplier.component';
import {SupplierDocumentComponent} from './components/supplier/dashboard-supplier/supplier-document/supplier-document.component';
import {SupplierDocumentDetailsComponent} from './components/supplier/dashboard-supplier/supplier-document-details/supplier-document-details.component';
import {SupplierSurveyComponent} from './components/supplier/dashboard-supplier/supplier-survey/supplier-survey.component';
import {SupplierHelpComponent} from './components/supplier/dashboard-supplier/supplier-help/supplier-help.component';
import {SupplierLoggedInGuard} from './auth/supplier-logged-in.guard';
import {DropoffSupplierDocumentComponent} from "./components/supplier/dashboard-supplier/dropoff-supplier-document/dropoff-supplier-document.component";
import { BackofficeDocumentComponent } from './components/backoffice/backoffice-document/backoffice-document.component';


const routes: Routes = [
  {
    path: 'supplier',
    children: [
      {
        path: 'login',
        component: SupplierLoginPageComponent
      },
      {
        path: 'dashboard', component: DashboardSupplierComponent,
        canActivate: [SupplierLoggedInGuard],
        children: [
          { path: 'survey', component: SupplierSurveyComponent },
          { path: 'help', component: SupplierHelpComponent },
          { path: 'documents', component: SupplierDocumentComponent },
          { path: 'documents/details', component: SupplierDocumentDetailsComponent },
          { path: 'documents/drop-off', component: DropoffSupplierDocumentComponent },
          { path: '', redirectTo: 'documents', pathMatch: 'full'}
        ]
      },
      {
        path: 'upload', component: SupplierUploadPageComponent, canActivate: [GuestGuard],
        children: [
          { path: '', component: SupplierUploadInterfaceComponent },
          { path: 'success', component: SupplierUploadSuccessComponent },
        ]
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  { path: 'login', component: LoginPageComponent, canActivate: [] },
  { path: 'admin/login', component: AdminLoginPageComponent, canActivate: [] },
  { path: 'reset_password', component: ResetPasswordComponent, canActivate: [] },
  { path: 'supplier/activationLink', component: GenerateActivationLinkComponent },
  { path: 'supplier/activation', component: ActivationLinkComponent },
  { path: 'logout', component: LogoutPageComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [LoggedinGuard],
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
      { path: 'users', component: UsersManagementComponent, data: { roles: Configuration.basicRoutesRoles } },
      { path: '', pathMatch: 'full', redirectTo: 'main'},
    ]
  },
  {
    path: 'backoffice', component: BackofficeComponent, canActivate: [BackofficeGuard],
    children: [
      { path: 'users', component: BackofficeUsersComponent },
      { path: 'suppliers', component: BackofficeSuppliersComponent },
      { path: 'client', component: BackofficeClientComponent },
      { path: 'documents', component: BackofficeDocumentComponent },
      { path: '', pathMatch: 'full', redirectTo: 'client'},
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
      {
        enableTracing: false,
        onSameUrlNavigation: 'reload'
      },
    )
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
