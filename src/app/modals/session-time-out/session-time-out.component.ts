import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-time-out',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './session-time-out.component.html',
  styleUrl: './session-time-out.component.scss'
})
export class SessionTimeOutComponent {

  @Input({ required: true }) visible: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  redirectToLogin() {
    this.authService.signOutUser();
    this.router.navigateByUrl('/login');
  }
}
