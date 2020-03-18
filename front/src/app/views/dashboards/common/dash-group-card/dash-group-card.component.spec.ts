import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashGroupCardComponent } from './dash-group-card.component';

describe('DashGroupCardComponent', () => {
  let component: DashGroupCardComponent;
  let fixture: ComponentFixture<DashGroupCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashGroupCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashGroupCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
