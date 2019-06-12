import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierInfoModalComponent } from './supplier-info-modal.component';

describe('SupplierInfoModalComponent', () => {
  let component: SupplierInfoModalComponent;
  let fixture: ComponentFixture<SupplierInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
