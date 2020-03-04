import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeUsersTableComponent } from './backoffice-users-table.component';

describe('BackofficeUsersTableComponent', () => {
  let component: BackofficeUsersTableComponent;
  let fixture: ComponentFixture<BackofficeUsersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeUsersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeUsersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
