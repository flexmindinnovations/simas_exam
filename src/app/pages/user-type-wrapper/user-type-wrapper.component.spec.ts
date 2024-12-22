import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTypeWrapperComponent } from './user-type-wrapper.component';

describe('UserTypeWrapperComponent', () => {
  let component: UserTypeWrapperComponent;
  let fixture: ComponentFixture<UserTypeWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTypeWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTypeWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
