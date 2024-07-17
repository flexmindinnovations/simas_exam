import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { UserType } from '../../enums/user-types';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, MenuModule, AvatarModule, AvatarGroupModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent implements OnInit {
  profileItems: MenuItem[] = [];

  ngOnInit(): void {
    this.setUserMenuItems();
  }

  setUserMenuItems() {
    this.profileItems = [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        styleClass: 'logout',
        routerLink: '/login',
        queryParams: { userType: UserType.ADMIN }
      }
    ]
  }
}
