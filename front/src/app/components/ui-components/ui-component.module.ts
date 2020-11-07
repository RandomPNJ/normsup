import {NgModule} from '@angular/core';
import {BackLinkComponent} from './back-link/back-link.component';
import {PageTitleComponent} from './page-title/page-title.component';
import {CardTemplateComponent} from './card-template/card-template.component';
import {CustomButtonComponent} from './custom-button/custom-button.component';
import {ListCardComponent} from './list-card/list-card.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    BackLinkComponent,
    PageTitleComponent,
    CardTemplateComponent,
    CustomButtonComponent,
    ListCardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    MDBBootstrapModule
  ],
  exports: [
    BackLinkComponent,
    PageTitleComponent,
    CardTemplateComponent,
    CustomButtonComponent,
    ListCardComponent
  ]
})
export class UiComponentModule {}
