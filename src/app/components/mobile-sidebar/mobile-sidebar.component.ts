import { Component, ChangeDetectorRef, OnChanges, Input, OnDestroy, OnInit, SimpleChanges, effect } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MENU_ITEMS } from '../../../../public/data/menu-items';
import { NavigationEnd, Router } from '@angular/router';
import { utils } from '../../utils';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-mobile-sidebar',
  standalone: true,
  imports: [CommonModule, BadgeModule, AvatarModule, InputTextModule, MenubarModule, UserMenuComponent, SidebarComponent],
  templateUrl: './mobile-sidebar.component.html',
  styleUrl: './mobile-sidebar.component.scss'
})
export class MobileSidebarComponent implements OnInit, OnChanges, OnDestroy {
  menuItems: MenuItem | any = MENU_ITEMS;
  moreMenuItems: Array<any> = [];

  isMoreMenuVisible: boolean = false;
  isMoreMenuActive: boolean = false;
  isLoading: boolean = true;
  isMobile: boolean = false;
  isTablet: boolean = false;

  readonly MENU_THRESHOLD = 7;

  activeItem: any;
  @Input({ required: true }) permissionList: any[] = [];
  constructor(
    private router: Router,
    private cdref: ChangeDetectorRef
  ) {
    effect(() => {
      this.isMobile = utils.isMobile();
      this.isTablet = utils.isTablet();
      if (utils.isPageRefreshed()) {
        const currentUrl = this.getCurrentUrl();
        currentUrl ? this.setActiveMenuItem(currentUrl) : this.setDefaultMenuItem();
      }
    }, { allowSignalWrites: true });

    effect(() => {
      this.activeItem = utils.activeItem();
    })
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.router.events.subscribe((router) => {
      if (router instanceof NavigationEnd) {
        const currentUrl = this.getCurrentUrl();
        currentUrl ? this.setActiveMenuItem(currentUrl) : this.setDefaultMenuItem();
      }
    });

    // this.menuItems = MENU_ITEMS.map((item: any) => {
    //   const obj = {
    //     ...item,
    //     label: item?.title,
    //     icon: item?.icon,
    //     command: () => {
    //       this.handleItemClick(item);
    //     }
    //   }
    //   return obj;
    // })
  }

  ngOnChanges(changes: SimpleChanges): void {
    const data = changes['permissionList']?.currentValue;
    if (data) {
      this.filterMenuItems(data);
      this.splitMenuItems();
    }
  }

  filterMenuItems(data: any[]) {
    const filteredMenuItems = MENU_ITEMS.filter((menuItem: any) =>
      data.some(item => this.normalizeRoute(item.moduleName) === this.normalizeRoute(menuItem.moduleName) && item.canView)
    );
    this.menuItems = filteredMenuItems;
  }

  splitMenuItems() {
    if (this.menuItems.length > this.MENU_THRESHOLD) {
      const mainMenuItems = this.menuItems.slice(0, this.MENU_THRESHOLD);
      const moreMenuItems = this.menuItems.slice(this.MENU_THRESHOLD);

      this.moreMenuItems = moreMenuItems.map((item: any) => ({
        ...item,
        isActive: false,
        label: item.title,
        command: () => this.handleMoreMenuItemClick(item)
      }));

      mainMenuItems.push(this.createMoreMenuItem(moreMenuItems));
      this.menuItems = mainMenuItems;
    }

    const currentUrl = this.getCurrentUrl();
    this.setActiveMenuItem(currentUrl);
  }

  createMoreMenuItem(moreItems: any): any {
    return {
      id: 22,
      title: 'More',
      label: 'More',
      moduleName: 'more',
      icon: 'pi pi-ellipsis-h',
      isActive: false,
      route: 'more',
      items: moreItems
    };
  }

  normalizeRoute(route: string): string {
    return route?.toLowerCase().trim().replace(/\s+/g, '') ?? '';
  }

  resetActiveState(menuItems?: any[]) {
    menuItems?.forEach(item => item.isActive = false);
    const moreMenu = document.getElementById('moreMenu');
    const classList = moreMenu?.classList;
    classList?.add('active');
  }

  removeMoreMenuActiveState() {
    const moreMenu = document.getElementById('moreMenu');
    const classList = moreMenu?.classList;
    classList?.remove('active');
  }

  handleOnFocus() {
    const currentUrl = this.getCurrentUrl();
    currentUrl ? this.setActiveMenuItem(currentUrl) : this.setDefaultMenuItem();
  }


  setActiveMenuItem(route: string) {
    const normalizedRoute = this.normalizeRoute(route);
    if (normalizedRoute) {
      const isMoreMenuItem = this.moreMenuItems.some(item => this.normalizeRoute(item.route) === normalizedRoute);
      if (isMoreMenuItem) {
        this.isMoreMenuActive = true;
        this.resetActiveState(this.moreMenuItems);
        const moreMenuItem = this.moreMenuItems.find(item => this.normalizeRoute(item.route) === normalizedRoute);
        if (moreMenuItem) {
          moreMenuItem.isActive = true;
        }
        utils.activeItem.set(moreMenuItem);
        utils.setPageTitle(moreMenuItem.title);
        this.cdref.detectChanges();
      } else {
        this.isMoreMenuActive = false;
        this.removeMoreMenuActiveState();
        const menuItem = this.menuItems.find((item: any) => this.normalizeRoute(item.route) === normalizedRoute);
        if (menuItem) {
          utils.activeItem.set(menuItem);
          utils.setPageTitle(menuItem.title);
          menuItem.isActive = true;
        }
      }
    } else {
      this.setDefaultMenuItem();
    }
  }

  handleItemClick(item: any) {
    if (item.moduleName !== 'more') {
      this.resetActiveState(this.menuItems);
      utils.activeItem.set(item);
      utils.setPageTitle(item.title);
      item.isActive = true;
      this.router.navigateByUrl(item.id === 1 ? 'app' : 'app/' + item.route);
    } else {
      this.toggleMoreMenu();
    }
    this.removeMoreMenuActiveState();
    item.isActive = true;
  }

  handleMoreMenuItemClick(item: any) {
    this.resetActiveState(this.moreMenuItems);
    utils.activeItem.set(item);
    utils.setPageTitle(item.title);
    item.isActive = true;
    this.cdref.detectChanges();
    this.router.navigateByUrl('app/' + item.route);
  }

  toggleMoreMenu() {
    this.isMoreMenuVisible = !this.isMoreMenuVisible;
  }

  getCurrentUrl(): string {
    return this.router.url.split('/')[2];
  }

  setDefaultMenuItem() {
    // debugger
    if (this.menuItems.length > 0) {
      this.menuItems.forEach((each: any) => each.isActive = false);
      utils.activeItem.set(this.menuItems[0]);
      utils.setPageTitle(this.menuItems[0].title);
      this.menuItems[0].isActive = true;
    }
    this.removeMoreMenuActiveState();
  }

  onMoreMenuShow() {
    const currentUrl = this.router.url.split('/')[2];
    if (currentUrl) {
      const trimmedRoute = currentUrl?.toLowerCase().trim().replace(/\s+/g, '');
      const moreMenuItem = this.moreMenuItems.find((each: any) => each.route.toLowerCase().trim().replace(/\s+/g, '') === trimmedRoute) ?? undefined;
      this.moreMenuItems.forEach((each, index) => each.isActive = false);
      if (moreMenuItem) {
        moreMenuItem.isActive = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.menuItems.forEach((menu: any) => menu.isActive = false);
  }
}
