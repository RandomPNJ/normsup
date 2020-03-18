import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConformComponent } from './non-conform.component';

describe('NonConformComponent', () => {
  let component: NonConformComponent;
  let fixture: ComponentFixture<NonConformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonConformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonConformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
