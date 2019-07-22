import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import { Daterangepicker } from 'ng2-daterangepicker';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import { GroupsTableComponent } from './components/groups/groups-table/groups-table.component';
import { AddSupplierModalComponent } from './components/supplier/add-supplier-modal/add-supplier-modal.component';
import { FocusDirective } from './directives/focus.directive';
import { SupplierInfoModalComponent } from './components/supplier/supplier-info-modal/supplier-info-modal.component';

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
    GroupsTableComponent,
    AddSupplierModalComponent,
    FocusDirective,
    SupplierInfoModalComponent,
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    Daterangepicker,
    FormsModule,
    NgbModule,
    SharedModule,
    ViewsModule,
    ErrorModule,
    BrowserAnimationsModule,
    MatSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    ShowHidePasswordModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    DataTablesModule
  ],
  exports: [
    AddSupplierModalComponent,
  ],
  entryComponents: [
    AddSupplierModalComponent
  ],
  providers: [
    BrowserStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
