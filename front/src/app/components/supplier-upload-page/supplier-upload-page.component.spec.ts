import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierUploadPageComponent } from './supplier-upload-page.component';

describe('SupplierUploadPageComponent', () => {
  let component: SupplierUploadPageComponent;
  let fixture: ComponentFixture<SupplierUploadPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierUploadPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierUploadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
