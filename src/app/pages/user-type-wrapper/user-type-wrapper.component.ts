import { Component, OnInit } from '@angular/core';
import { UserTypeService } from '../../services/user-type.service'; // Adjust path
import { HomeComponent } from '../home/home.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-user-type-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-type-wrapper.component.html',
  styleUrl: './user-type-wrapper.component.scss'
})
export class UserTypeWrapperComponent implements OnInit {
  outlet: any;

  constructor(private userTypeService: UserTypeService) { }

  ngOnInit() {
    const userType = this.userTypeService.getUserType();
    if (userType === 'Admin') {
      this.outlet = HomeComponent;
    } else {
      this.outlet = DashboardComponent;
    }
  }
}
