import {NgModule} from '@angular/core';
import {BackLinkComponent} from './back-link/back-link.component';
import {PageTitleComponent} from './page-title/page-title.component';
import {CardTemplateComponent} from './card-template/card-template.component';
import {CustomButtonComponent} from './custom-button/custom-button.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {CardDocumentTemplateComponent} from './card-document-templat/card-document-template.component';

const components = [
    BackLinkComponent,
    PageTitleComponent,
    CardTemplateComponent,
    CustomButtonComponent,
    CardDocumentTemplateComponent
];

@NgModule({
  declarations: [
    components
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    MDBBootstrapModule
  ],
  exports: [
    components
  ]
})
export class UiComponentModule {}
