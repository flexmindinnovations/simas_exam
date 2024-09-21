import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopSidebarComponent } from './desktop-sidebar.component';

describe('DesktopSidebarComponent', () => {
  let component: DesktopSidebarComponent;
  let fixture: ComponentFixture<DesktopSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
