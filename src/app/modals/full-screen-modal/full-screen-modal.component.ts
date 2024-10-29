import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { UserType } from '../../enums/user-types';

@Component({
  selector: 'app-full-screen-modal',
  standalone: true,
  imports: [DialogModule,ButtonModule],
  templateUrl: './full-screen-modal.component.html',
  styleUrl: './full-screen-modal.component.scss'
})
export class FullScreenModalComponent {
  @Input() visible: boolean = false;
  @Input() message: string = ''
  title:string = 'Access Denied';

  constructor(
    private authService: AuthService,
    private router: Router,
    ) { }

  handleDialogLogout(){
    this.authService.signOutUser();
    this.router.navigate(['/login'],
      {
        queryParams: {
          userType: UserType.ADMIN
        }
      })
  }
}
