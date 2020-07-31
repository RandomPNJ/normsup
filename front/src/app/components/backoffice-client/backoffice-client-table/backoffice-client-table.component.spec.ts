import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeClientTableComponent } from './backoffice-client-table.component';

describe('BackofficeClientTableComponent', () => {
  let component: BackofficeClientTableComponent;
  let fixture: ComponentFixture<BackofficeClientTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeClientTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeClientTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
