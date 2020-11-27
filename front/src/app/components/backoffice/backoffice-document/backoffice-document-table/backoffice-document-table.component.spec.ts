import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeDocumentTableComponent } from './backoffice-document-table.component';

describe('BackofficeDocumentTableComponent', () => {
  let component: BackofficeDocumentTableComponent;
  let fixture: ComponentFixture<BackofficeDocumentTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeDocumentTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeDocumentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
