import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';

// import { CalendarModule,  } from 'angular-calendar';
import { SharedModule } from '../shared/shared.module';

import { BasicTableComponent } from './tables/basic-table/basic-table.component';
import { ModalsComponent } from './modals/modals.component';
import { Map1Component } from './maps/map1/map1.component';
import { StatsCardComponent } from './dashboards/common/stats-card/stats-card.component';
import { StatsCard2Component } from './dashboards/common/stats-card2/stats-card2.component';
import { Dashboard1Component } from './dashboards/dashboard1/dashboard1.component';
import { HelpComponent } from './help/help.component';
import { NonConformComponent } from './dashboards/common/non-conform/non-conform.component';
import { OfflineCardComponent } from './dashboards/common/offline-card/offline-card.component';
import { DashGroupCardComponent } from './dashboards/common/dash-group-card/dash-group-card.component';
import { SupplierPerGroupComponent } from './dashboards/common/supplier-per-group/supplier-per-group.component';
import { MonthlyConformityComponent } from './dashboards/common/monthly-conformity/monthly-conformity.component';
import { ConformityRateGraphComponent } from './dashboards/common/conformity-rate-graph/conformity-rate-graph.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AgmCoreModule.forRoot({
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en#key
      apiKey: ''
    }),
    // CalendarModule.forRoot()
  ],
  declarations: [
    BasicTableComponent,
    ModalsComponent,
    Map1Component,
    StatsCardComponent,
    StatsCard2Component,
    Dashboard1Component,
    HelpComponent,
    NonConformComponent,
    OfflineCardComponent,
    DashGroupCardComponent,
    SupplierPerGroupComponent,
    MonthlyConformityComponent,
    ConformityRateGraphComponent,

  ],
  exports: [
    BasicTableComponent,
    ModalsComponent,
    Map1Component,
    StatsCardComponent,
    StatsCard2Component,
    Dashboard1Component,
    NonConformComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ViewsModule { }
