import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserType } from '../../enums/user-types';
import { AuthService } from '../../services/auth/auth.service';
import { utils } from '../../utils';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
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
