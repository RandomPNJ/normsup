import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeSuppliersComponent } from './backoffice-suppliers.component';

describe('BackofficeSuppliersComponent', () => {
  let component: BackofficeSuppliersComponent;
  let fixture: ComponentFixture<BackofficeSuppliersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeSuppliersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
