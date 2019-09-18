import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompGroupComponent } from './add-comp-group.component';

describe('AddCompGroupComponent', () => {
  let component: AddCompGroupComponent;
  let fixture: ComponentFixture<AddCompGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
