import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierUploadInterfaceComponent } from './supplier-upload-interface.component';

describe('SupplierUploadInterfaceComponent', () => {
  let component: SupplierUploadInterfaceComponent;
  let fixture: ComponentFixture<SupplierUploadInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierUploadInterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierUploadInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
