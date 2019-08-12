import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompDocModalComponent } from './comp-doc-modal.component';

describe('CompDocModalComponent', () => {
  let component: CompDocModalComponent;
  let fixture: ComponentFixture<CompDocModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompDocModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompDocModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
