import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeSuppliersTableComponent } from './backoffice-suppliers-table.component';

describe('BackofficeSuppliersTableComponent', () => {
  let component: BackofficeSuppliersTableComponent;
  let fixture: ComponentFixture<BackofficeSuppliersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeSuppliersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeSuppliersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
