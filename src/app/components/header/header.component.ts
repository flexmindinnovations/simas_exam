import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { utils } from '../../utils';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, UserMenuComponent, SidebarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  sideBarOpened: boolean = true;
  isMobile: boolean = false;
  isTablet: boolean = false;
  activeItem: any = {};
  permissionList: any[] = [];

  logoSrc: string = '/images/logo1.png';

  constructor() {

    effect(() => {
      this.permissionList = utils.permissionList();
    })
    effect(() => {
      this.sideBarOpened = utils.sideBarOpened();
    })

    effect(() => {
      this.activeItem = utils.activeItem();
    })

    effect(() => {
      this.isMobile = utils.isMobile();
      this.isTablet = utils.isTablet();
    })
  }
  toggleSidebar() {
    utils.sideBarOpened.update(val => !val);
  }
}
