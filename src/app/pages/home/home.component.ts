import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserType } from '../../enums/user-types';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  userName: string = 'Imran';

  ngOnInit(): void {
    // if (!this.authService.isLoggedIn()) {
    //   this.router.navigateByUrl(`login?userType=${UserType.ADMIN}`);
    // }

  }
}
