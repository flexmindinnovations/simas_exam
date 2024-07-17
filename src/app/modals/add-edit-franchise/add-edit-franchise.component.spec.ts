import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFranchiseComponent } from './add-edit-franchise.component';

describe('AddEditFranchiseComponent', () => {
  let component: AddEditFranchiseComponent;
  let fixture: ComponentFixture<AddEditFranchiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditFranchiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditFranchiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
