import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRepresentativeComponent } from './add-representative.component';

describe('AddRepresentativeComponent', () => {
  let component: AddRepresentativeComponent;
  let fixture: ComponentFixture<AddRepresentativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRepresentativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
