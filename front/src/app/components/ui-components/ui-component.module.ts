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
import {CheckboxFormComponent} from './checkbox-form/checkbox-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const components = [
  BackLinkComponent,
  CardDocumentTemplateComponent,
  CardTemplateComponent,
  CheckboxFormComponent,
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
    MDBBootstrapModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    components
  ]
})
export class UiComponentModule {}
