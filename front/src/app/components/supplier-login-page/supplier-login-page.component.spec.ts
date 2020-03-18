import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierLoginPageComponent } from './supplier-login-page.component';

describe('SupplierLoginPageComponent', () => {
  let component: SupplierLoginPageComponent;
  let fixture: ComponentFixture<SupplierLoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierLoginPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
