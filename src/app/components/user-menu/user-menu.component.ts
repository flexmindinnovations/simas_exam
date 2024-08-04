import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { UserType } from '../../enums/user-types';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, MenuModule, AvatarModule, AvatarGroupModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent implements OnInit {
  profileItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.setUserMenuItems();
  }

  setUserMenuItems() {
    this.profileItems = [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        styleClass: 'logout',
        command: ((event: MenuItemCommandEvent) => {
          this.authService.signOutUser();
          this.router.navigate(['/login'],
            {
              queryParams: {
                userType: UserType.ADMIN
              }
            }
          )
        })
      }
    ]

  }
}
