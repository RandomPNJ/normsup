import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierUploadSuccessComponent } from './supplier-upload-success.component';

describe('SupplierUploadSuccessComponent', () => {
  let component: SupplierUploadSuccessComponent;
  let fixture: ComponentFixture<SupplierUploadSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierUploadSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierUploadSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
