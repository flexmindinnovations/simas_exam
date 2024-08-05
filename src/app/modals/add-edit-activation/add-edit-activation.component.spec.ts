import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditActivationComponent } from './add-edit-activation.component';

describe('AddEditActivationComponent', () => {
  let component: AddEditActivationComponent;
  let fixture: ComponentFixture<AddEditActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditActivationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
