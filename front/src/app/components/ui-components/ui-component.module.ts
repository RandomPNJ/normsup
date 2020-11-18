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
import {UploadDocumentBtnComponent} from './upload-document-btn/upload-document-btn.component';

const components = [
  BackLinkComponent,
  CardDocumentTemplateComponent,
  CardTemplateComponent,
  CustomButtonComponent,
  PageTitleComponent,
  UploadDocumentBtnComponent
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
