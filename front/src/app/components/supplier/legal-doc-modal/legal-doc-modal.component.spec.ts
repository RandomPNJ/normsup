import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalDocModalComponent } from './legal-doc-modal.component';

describe('LegalDocModalComponent', () => {
  let component: LegalDocModalComponent;
  let fixture: ComponentFixture<LegalDocModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalDocModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalDocModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
