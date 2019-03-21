import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { MainSearchComponent } from './components/main-search/main-search.component';
// import { ResPageComponent } from './components/res-page/res-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
// import { ResultsPageComponent } from './components/results-page/results-page.component';
// import { DataEntryComponent } from './components/data-entry/data-entry.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  // { path: 'search', component: MainSearchComponent },
  // { path: 'results', component: ResPageComponent },
  // { path: 'resultspage', component: ResultsPageComponent },
  // { path: 'dataEntry', component: DataEntryComponent },
 { path: 'headerBar', component: HeaderBarComponent },
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
