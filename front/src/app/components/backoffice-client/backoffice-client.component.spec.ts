import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeClientComponent } from './backoffice-client.component';

describe('BackofficeClientComponent', () => {
  let component: BackofficeClientComponent;
  let fixture: ComponentFixture<BackofficeClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
