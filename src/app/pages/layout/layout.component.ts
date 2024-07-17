import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, effect, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { utils } from '../../utils';
import { SidebarModule } from 'primeng/sidebar';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgHttpLoaderModule, Spinkit } from "ng-http-loader";
import {
  BreakpointObserver, Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Message, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { AuthService } from '../../services/auth/auth.service';
import { UserType, UserTypeObj } from '../../enums/user-types';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, LoadingBarRouterModule, LoadingBarModule, NgHttpLoaderModule, RouterOutlet, HeaderComponent, SidebarComponent, NotFoundComponent, SidebarModule, MessagesModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  animations: [utils.slideInRouter]
})
export class LayoutComponent implements OnInit, AfterViewInit {
  sideBarOpened: boolean = true;
  mobileMode: string = 'portrait';
  tabletMode: string = 'portrait';
  isMobile: boolean = false;
  isTablet: boolean = false;
  isMenuItemClicked: boolean = false;
  messages: any[] = [];

  public spinkit = Spinkit;
  userType: string = 'admin';

  constructor(
    private breakPointObserver: BreakpointObserver,
    private cdref: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
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
      this.messages = utils.messages();
      setTimeout(() => {
        const closeButtonEl = document.getElementsByClassName('p-message-close')[0] as HTMLButtonElement;
        if (closeButtonEl) {
          closeButtonEl.click();
          utils.messages.set([]);
        }
      }, utils.alertTimer);
    })

    effect(() => {
      this.isMobile = utils.isMobile();
      this.isTablet = utils.isTablet();
    })

    effect(() => {
      this.userType = utils.userType();
    })

    effect(() => {
      this.isMenuItemClicked = utils.menuItemClick();
      if (this.isMenuItemClicked) this.handleSidebarOnHide();
    }, { allowSignalWrites: true })
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      const userTypes: any = UserTypeObj;
      const userType = userTypes[this.userType];
      this.router.navigateByUrl(`login?userType=${userType}`);
    }
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

  ngAfterViewInit(): void {
    this.cdref.detectChanges();
  }

  handleSidebarOnHide() {
    if (this.isMobile) {
      utils.sideBarOpened.update(val => !val);
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
