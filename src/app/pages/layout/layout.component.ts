import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, effect, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { utils } from '../../utils';
import { SidebarModule } from 'primeng/sidebar';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgHttpLoaderModule, Spinkit } from "ng-http-loader";
import {
  BreakpointObserver, Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { AuthService } from '../../services/auth/auth.service';
import { UserType, UserTypeObj } from '../../enums/user-types';
import { db } from '../../../db';
import { DeviceDetectorService } from 'ngx-device-detector';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterAnimation } from '../../utils/animations';
import { FullScreenModalComponent } from '../../modals/full-screen-modal/full-screen-modal.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, LoadingBarRouterModule, LoadingBarModule, NgHttpLoaderModule, RouterOutlet, HeaderComponent, SidebarComponent, SidebarModule, MessagesModule, MenubarModule, FullScreenModalComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate('200ms ease-in-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('500ms ease-in-out', style({ opacity: 0, transform: 'scale(0)' }))
      ])
    ]),
    RouterAnimation]
})
export class LayoutComponent implements OnInit, AfterViewInit {
  sideBarOpened: boolean = false;
  mobileMode: string = 'portrait';
  tabletMode: string = 'portrait';
  isMobile: boolean = false;
  isTablet: boolean = false;
  isMenuItemClicked: boolean = false;
  messages: any[] = [];
  showPermissionPop: boolean = false;

  permissionList: any[] = [];

  public spinkit = Spinkit;
  userType: string = 'admin';

  isWarningPhase: boolean = false;
  isDangerPhase: boolean = false;
  isUserSessionEnded: boolean = false;

  constructor(
    private breakPointObserver: BreakpointObserver,
    private cdref: ChangeDetectorRef,
    private deviceDetector: DeviceDetectorService,
    private authService: AuthService,
    private router: Router
  ) {

    effect(() => {
      this.isUserSessionEnded = utils.isUserSessionEnded();
      this.cdref.detectChanges();
    })

    effect(() => {
      this.sideBarOpened = utils.sideBarOpened();
      if (this.isMobile) {
        setTimeout(() => {
          const mobileSidebar = document.getElementsByClassName('p-sidebar')[0];
          const pSidebarMask = document.querySelector('.p-component-overlay.p-sidebar-mask');
          mobileSidebar?.removeChild(mobileSidebar?.children[0]);
          if (pSidebarMask) {
            pSidebarMask.remove();
          }
        })
      }
    })

    effect((onCleanup) => {
      this.messages = utils.messages();
      const itemIndex = utils.messages().length > 0 ? utils.messages().length - 1 : 0;
      if (this.messages.length) {
        setTimeout(() => {
          utils.clearMessage(itemIndex);
        }, utils.alertTimer);
      }
    }, { allowSignalWrites: true })

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

    effect(() => {
      this.isWarningPhase = utils.isWarningPhase();
      this.isDangerPhase = utils.isDangerPhase();
    })
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      const userTypes: any = UserTypeObj;
      const userType = userTypes[this.userType];
      this.router.navigateByUrl(`login?userType=${userType}`);
    }
    this.detectCurrentDeviceType();
  }

  detectCurrentDeviceType() {
    // Set up matchMedia listeners for each breakpoint
    const xSmallMediaQuery = window.matchMedia('(max-width: 599px)');
    const smallMediaQuery = window.matchMedia('(min-width: 600px) and (max-width: 959px)');
    const mediumMediaQuery = window.matchMedia('(min-width: 960px) and (max-width: 1279px)');
    const largeMediaQuery = window.matchMedia('(min-width: 1280px) and (max-width: 1919px)');
    const xLargeMediaQuery = window.matchMedia('(min-width: 1920px)');

    // Function to detect screen size and device type
    function detectDeviceType() {
      if (xSmallMediaQuery.matches) {
        utils.deviceType.set('mobile');
        utils.isMobile.set(true);
        utils.isTablet.set(false);
      } else if (smallMediaQuery.matches) {
        utils.deviceType.set('mobile');
        utils.isMobile.set(true);
        utils.isTablet.set(false);
      } else if (mediumMediaQuery.matches) {
        utils.deviceType.set('tablet');
        utils.isTablet.set(true);
        utils.isMobile.set(false);
      } else if (largeMediaQuery.matches) {
        utils.deviceType.set('laptop');
        utils.isMobile.set(false);
        utils.isTablet.set(false);
      } else if (xLargeMediaQuery.matches) {
        utils.deviceType.set('desktop');
        utils.isMobile.set(false);
        utils.isTablet.set(false);
      }
    }

    // Call the function once to detect the device type initially
    detectDeviceType();

    // Optionally, add event listeners for changes in screen size
    xSmallMediaQuery.addEventListener('change', detectDeviceType);
    smallMediaQuery.addEventListener('change', detectDeviceType);
    mediumMediaQuery.addEventListener('change', detectDeviceType);
    largeMediaQuery.addEventListener('change', detectDeviceType);
    xLargeMediaQuery.addEventListener('change', detectDeviceType);
  }

  async getPermissionList() {
    const permissionList = await db.permissiontem.toArray();
    if (permissionList.length) {
      this.permissionList = permissionList;
      utils.permissionList.set(permissionList);
    }

    const viewableModules = permissionList.filter(permission => permission.canView);
    if (viewableModules.length === 0) {
      this.showPermissionPop = true;
    }
  }

  ngAfterViewInit(): void {
    this.getPermissionList();
    this.cdref.detectChanges();
  }

  handleSidebarOnHide() {
    if (this.isMobile) {
      if (this.sideBarOpened) {
        utils.sideBarOpened.update(val => !val);
      }
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
