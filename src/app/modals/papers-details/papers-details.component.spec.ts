import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PapersDetailsComponent } from './papers-details.component';

describe('PapersDetailsComponent', () => {
  let component: PapersDetailsComponent;
  let fixture: ComponentFixture<PapersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PapersDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PapersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
