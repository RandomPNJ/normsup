import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeDocumentComponent } from './backoffice-document.component';

describe('BackofficeDocumentComponent', () => {
  let component: BackofficeDocumentComponent;
  let fixture: ComponentFixture<BackofficeDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
