import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FileUploadModule } from 'ng2-file-upload';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CountdownModule } from 'ngx-countdown';

import {HttpModule} from '@angular/http';
import { Daterangepicker } from 'ng2-daterangepicker';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NotifComponent } from './directives/notif/notif.component';
import { ClickOutsideDirective } from './directives/clickOutside.directive';
import { NotifService } from './services/notif.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { ModalComponent } from './components/modal/modal.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSelectModule } from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ChartsModule } from 'ng2-charts';
import { BrowserStorageService } from './services/storageService';
import { ViewsModule } from './views/views.module';
import { SharedModule } from './shared/shared.module';
import { ErrorModule } from './views/errors/error.module';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { GroupsComponent } from './components/groups/groups.component';
import { StatsComponent } from './components/stats/stats.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { ReminderComponent } from './components/reminder/reminder.component';
import { SupplierTableComponent } from './components/supplier-table/supplier-table.component';
import { AddSupplierModalComponent } from './components/supplier/add-supplier-modal/add-supplier-modal.component';
import { FocusDirective } from './directives/focus.directive';
import { SupplierInfoModalComponent } from './components/supplier/supplier-info-modal/supplier-info-modal.component';
import { LegalDocModalComponent } from './components/supplier/legal-doc-modal/legal-doc-modal.component';
import { CompDocModalComponent } from './components/supplier/comp-doc-modal/comp-doc-modal.component';
import { AddCompGroupComponent } from './components/groups/add-comp-group/add-comp-group.component';
import { UsersManagementComponent } from './components/users-management/users-management.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersTableComponent } from './components/users-management/users-table/users-table.component';
import { GuestGuard } from './auth/guest.guard';
import { LoggedinGuard } from './auth/loggedin.guard';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProfileFlyoverComponent } from './components/profile-flyover/profile-flyover.component';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { SelectListComponent } from './components/groups/select-list/select-list.component';
import { GroupDetailsComponent } from './components/groups/group-details/group-details.component';
import { GroupListComponent } from './components/groups/group-list/group-list.component';
import { ExportComponent } from './components/export/export.component';
import { LogoutPageComponent } from './components/logout-page/logout-page.component';
import { SupplierUploadPageComponent } from './components/supplier-upload-page/supplier-upload-page.component';
import { SupplierUploadSuccessComponent } from './components/supplier-upload-page/supplier-upload-success/supplier-upload-success.component';
import { SupplierUploadInterfaceComponent } from './components/supplier-upload-page/supplier-upload-interface/supplier-upload-interface.component';
import { BackofficeUsersComponent } from './components/backoffice-users/backoffice-users.component';
import { BackofficeUsersTableComponent } from './components/backoffice-users/backoffice-users-table/backoffice-users-table.component';
import { BackofficeComponent } from './components/backoffice/backoffice.component';
import { SupplierLoginPageComponent } from './components/supplier-login-page/supplier-login-page.component';
import { BackofficeSuppliersComponent } from './components/backoffice-suppliers/backoffice-suppliers.component';
import { BackofficeSuppliersTableComponent } from './components/backoffice-suppliers/backoffice-suppliers-table/backoffice-suppliers-table.component';
import { CookieService } from 'ngx-cookie-service';
import { HttpConfigInterceptor} from './interceptors/httpconfig.interceptor';
import { AddRepresentativeComponent } from './components/supplier/add-representative/add-representative.component';
import { BackofficeClientComponent } from './components/backoffice-client/backoffice-client.component';
import { BackofficeClientTableComponent } from './components/backoffice-client/backoffice-client-table/backoffice-client-table.component';
import { AdminLoginPageComponent } from './components/admin-login-page/admin-login-page.component';
import { ActivationLinkComponent } from './components/activation-link/activation-link.component';
import { GenerateActivationLinkComponent } from './components/generate-activation-link/generate-activation-link.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderBarComponent,
    LoginPageComponent,
    ModalComponent,
    DashboardComponent,
    MainDashboardComponent,
    SupplierComponent,
    GroupsComponent,
    StatsComponent,
    AlertsComponent,
    ReminderComponent,
    SupplierTableComponent,
    AddSupplierModalComponent,
    FocusDirective,
    ClickOutsideDirective,
    SupplierInfoModalComponent,
    NotifComponent,
    LegalDocModalComponent,
    CompDocModalComponent,
    AddCompGroupComponent,
    UsersManagementComponent,
    ProfileComponent,
    UsersTableComponent,
    SidebarComponent,
    ProfileFlyoverComponent,
    NumberOnlyDirective,
    SelectListComponent,
    GroupDetailsComponent,
    GroupListComponent,
    ExportComponent,
    LogoutPageComponent,
    SupplierUploadPageComponent,
    SupplierUploadSuccessComponent,
    SupplierUploadInterfaceComponent,
    BackofficeUsersComponent,
    BackofficeUsersTableComponent,
    BackofficeComponent,
    SupplierLoginPageComponent,
    BackofficeSuppliersComponent,
    BackofficeSuppliersTableComponent,
    AddRepresentativeComponent,
    BackofficeClientComponent,
    BackofficeClientTableComponent,
    AdminLoginPageComponent,
    ActivationLinkComponent,
    GenerateActivationLinkComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    AppRoutingModule,
    NgSelectModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    Daterangepicker,
    FormsModule,
    NgbModule,
    ChartsModule,
    SharedModule,
    FileUploadModule,
    ViewsModule,
    ErrorModule,
    BrowserAnimationsModule,
    MatSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    ShowHidePasswordModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    DataTablesModule,
    CountdownModule,
  ],
  exports: [
    AddSupplierModalComponent,
  ],
  entryComponents: [
    AddSupplierModalComponent,
  ],
  providers: [
    BrowserStorageService,
    GuestGuard,
    LoggedinGuard,
    NotifService,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
