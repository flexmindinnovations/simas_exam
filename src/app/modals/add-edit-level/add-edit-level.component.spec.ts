import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLevelComponent } from './add-edit-level.component';

describe('AddEditLevelComponent', () => {
  let component: AddEditLevelComponent;
  let fixture: ComponentFixture<AddEditLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
