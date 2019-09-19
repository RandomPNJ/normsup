import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFlyoverComponent } from './profile-flyover.component';

describe('ProfileFlyoverComponent', () => {
  let component: ProfileFlyoverComponent;
  let fixture: ComponentFixture<ProfileFlyoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileFlyoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFlyoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
