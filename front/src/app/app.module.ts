import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import { Daterangepicker } from 'ng2-daterangepicker';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from './components/modal/modal.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSelectModule } from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BrowserStorageService } from './services/storageService';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { GroupsComponent } from './components/groups/groups.component';
import { StatsComponent } from './components/stats/stats.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { ReminderComponent } from './components/reminder/reminder.component';
import { GroupTableComponent } from './components/groups/group-table/group-table.component';
import { SupplierTableComponent } from './components/supplier-table/supplier-table.component';

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
    GroupTableComponent,
    SupplierTableComponent,
  ],
  imports: [
    BrowserModule,
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
  ],
  exports: [
    ModalComponent,
  ],
  providers: [
    BrowserStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
