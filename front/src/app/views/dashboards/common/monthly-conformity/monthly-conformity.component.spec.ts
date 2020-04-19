import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyConformityComponent } from './monthly-conformity.component';

describe('MonthlyConformityComponent', () => {
  let component: MonthlyConformityComponent;
  let fixture: ComponentFixture<MonthlyConformityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyConformityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyConformityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
