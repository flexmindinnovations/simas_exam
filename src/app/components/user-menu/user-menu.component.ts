import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, MenuModule, AvatarModule, AvatarGroupModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent implements OnInit {
  profileItems: any[] = [];

  ngOnInit(): void {

  }
}
