import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPerGroupComponent } from './supplier-per-group.component';

describe('SupplierPerGroupComponent', () => {
  let component: SupplierPerGroupComponent;
  let fixture: ComponentFixture<SupplierPerGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierPerGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
