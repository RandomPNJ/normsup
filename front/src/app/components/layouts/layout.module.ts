import {NgModule} from '@angular/core';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {ResponsiveListCardLayoutComponent} from './responsive-list-card-layout/responsive-list-card-layout.component';

const layoutComponents = [
  ResponsiveListCardLayoutComponent
];

@NgModule({
  declarations: [
    layoutComponents
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    MDBBootstrapModule
  ],
  exports: [
    layoutComponents
  ]
})
export class LayoutModule {}
