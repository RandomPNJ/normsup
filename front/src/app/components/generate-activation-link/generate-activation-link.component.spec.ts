import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateActivationLinkComponent } from './generate-activation-link.component';

describe('GenerateActivationLinkComponent', () => {
  let component: GenerateActivationLinkComponent;
  let fixture: ComponentFixture<GenerateActivationLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateActivationLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateActivationLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
