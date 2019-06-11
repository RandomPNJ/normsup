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
import { StatsCardComponent } from './components/dashboards/common/stats-card/stats-card.component';
import { StatsCard2Component } from './components/dashboards/common/stats-card2/stats-card2.component';

import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { Dashboard1Component } from './components/dashboards/dashboard1/dashboard1.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { GroupsComponent } from './components/groups/groups.component';
import { StatsComponent } from './components/stats/stats.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { ReminderComponent } from './components/reminder/reminder.component';
import { SupplierTableComponent } from './components/supplier-table/supplier-table.component';
import { GroupsTableComponent } from './components/groups/groups-table/groups-table.component';
import { AddSupplierModalComponent } from './components/supplier/add-supplier-modal/add-supplier-modal.component';
import { FocusDirective } from './directives/focus.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderBarComponent,
    LoginPageComponent,
    ModalComponent,
    DashboardComponent,
    MainDashboardComponent,
    Dashboard1Component,
    SupplierComponent,
    GroupsComponent,
    StatsComponent,
    StatsCardComponent,
    StatsCard2Component,
    AlertsComponent,
    ReminderComponent,
    SupplierTableComponent,
    GroupsTableComponent,
    AddSupplierModalComponent,
    FocusDirective,
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
