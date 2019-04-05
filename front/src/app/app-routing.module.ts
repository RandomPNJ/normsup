import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { GroupsComponent } from './components/groups/groups.component';
import { StatsComponent } from './components/stats/stats.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { ReminderComponent } from './components/reminder/reminder.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'main', component: MainDashboardComponent },
      { path: 'supplier', component: SupplierComponent },
      { path: 'groups', component: GroupsComponent },
      { path: 'stats', component: StatsComponent },
      { path: 'alerts', component: AlertsComponent },
      { path: 'reminder', component: ReminderComponent },
      { path: '', pathMatch: 'full', redirectTo: 'supplier'},
    ]
  },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
