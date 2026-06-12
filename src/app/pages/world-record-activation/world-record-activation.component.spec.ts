import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldRecordActivationComponent } from './world-record-activation.component';

describe('WorldRecordActivationComponent', () => {
  let component: WorldRecordActivationComponent;
  let fixture: ComponentFixture<WorldRecordActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldRecordActivationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorldRecordActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
