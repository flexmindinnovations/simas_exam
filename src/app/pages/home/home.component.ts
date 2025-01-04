import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserType } from '../../enums/user-types';
import { AuthService } from '../../services/auth/auth.service';
import { utils } from '../../utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  private authService = inject(AuthService);
  private router = inject(Router);
  greetMessage: string = '';
  currentTime: string = '';
  currentDate: string = '';

  userName: string = 'Imran';

  dateTimeInterval: any;
  studentCount = 1500;
  activeStudentsCount = 1200;
  pendingStudentsCount = 300;

  instructorCount = 75;
  fullTimeInstructorsCount = 50;
  partTimeInstructorsCount = 25;

  franchiseCount = 10;
  activeFranchisesCount = 8;
  pendingFranchisesCount = 2;

  iconColors: any = {
    Students: 'text-blue-800',
    Instructors: 'text-green-800',
    Franchise: 'text-violet-800',
  };

  hoverColors: any = {
    Students: 'hover:bg-blue-100',
    Instructors: 'hover:bg-green-100',
    Franchise: 'hover:bg-violet-100',
  };

  bgColors: any = {
    Students: 'bg-blue-200',
    Instructors: 'bg-green-200',
    Franchise: 'bg-violet-200',
  };


  textColors: any = {
    Students: 'text-blue-800',
    Instructors: 'text-green-800',
    Franchise: 'text-violet-800',
  };

  cardData = [
    {
      title: 'Students',
      count: this.studentCount,
      activeCount: this.activeStudentsCount,
      pendingCount: this.pendingStudentsCount,
      icon: 'pi-users',
    },
    {
      title: 'Instructors',
      count: this.instructorCount,
      activeCount: this.fullTimeInstructorsCount,
      pendingCount: this.partTimeInstructorsCount,
      icon: 'pi-user',
    },
    {
      title: 'Franchise',
      count: this.franchiseCount,
      activeCount: this.activeFranchisesCount,
      pendingCount: this.pendingFranchisesCount,
      icon: 'pi-briefcase',
    },
  ];

  constructor() { }

  ngOnInit(): void {
    this.greetMessage = utils.getGreeting();
    this.dateTimeInterval = setInterval(() => {
      const dateTime = utils.getDateTime().split('/');
      this.currentTime = dateTime[1];
      this.currentDate = dateTime[0];
    }, 1000);
    // if (!this.authService.isLoggedIn()) {
    //   this.router.navigateByUrl(`login?userType=${UserType.ADMIN}`);
    // }

  }

  ngOnDestroy(): void {
    clearInterval(this.dateTimeInterval);
  }

}
