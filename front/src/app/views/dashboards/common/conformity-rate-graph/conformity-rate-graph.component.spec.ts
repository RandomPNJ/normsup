import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformityRateGraphComponent } from './conformity-rate-graph.component';

describe('ConformityRateGraphComponent', () => {
  let component: ConformityRateGraphComponent;
  let fixture: ComponentFixture<ConformityRateGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConformityRateGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformityRateGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
