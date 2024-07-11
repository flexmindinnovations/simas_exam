import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { utils } from '../../utils';
import { SidebarModule } from 'primeng/sidebar';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgHttpLoaderModule } from "ng-http-loader";
import {
  BreakpointObserver, Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, LoadingBarRouterModule, LoadingBarModule, NgHttpLoaderModule, RouterOutlet, HeaderComponent, SidebarComponent, NotFoundComponent, SidebarModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  sideBarOpened: boolean = true;
  mobileMode: string = 'portrait';
  tabletMode: string = 'portrait';
  isMobile: boolean = false;
  isTablet: boolean = false;
  isMenuItemClicked: boolean = false;

  constructor(
    private breakPointObserver: BreakpointObserver
  ) {

    effect(() => {
      this.sideBarOpened = utils.sideBarOpened();

      if (this.isMobile) {
        setTimeout(() => {
          const mobileSidebar = document.getElementsByClassName('p-sidebar')[0];
          mobileSidebar?.removeChild(mobileSidebar?.children[0]);
        })
      }
    })

    effect(() => {
      this.isMobile = utils.isMobile();
      this.isTablet = utils.isTablet();
    })

    effect(() => {
      this.isMenuItemClicked = utils.menuItemClick();
      if (this.isMenuItemClicked) this.handleSidebarOnHide();
    }, { allowSignalWrites: true })
  }
  ngOnInit(): void {
    this.breakPointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe((value: BreakpointState) => {
      if (value.matches && this.breakPointObserver.isMatched(Breakpoints.XSmall) || this.breakPointObserver.isMatched(Breakpoints.Small)) {
        utils.isMobile.set(true);
        utils.isTablet.set(false);
      } else if (value.matches && this.breakPointObserver.isMatched(Breakpoints.Medium)) {
        utils.isMobile.set(false);
        utils.isTablet.set(true);
      }
    })
  }

  handleSidebarOnHide() {
    if (this.isMobile) {
      utils.sideBarOpened.update(val => !val);
    }
  }
}
