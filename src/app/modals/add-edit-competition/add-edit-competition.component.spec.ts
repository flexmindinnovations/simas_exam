import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCompetitionComponent } from './add-edit-competition.component';

describe('AddEditCompetitionComponent', () => {
  let component: AddEditCompetitionComponent;
  let fixture: ComponentFixture<AddEditCompetitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCompetitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
