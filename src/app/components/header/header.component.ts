import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { utils } from '../../utils';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  sideBarOpened: boolean = true;
  isMobile: boolean = false;
  isTablet: boolean = false;
  activeItem: any = {};

  constructor() {

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
