import { Component, effect, ElementRef, Input, input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { utils } from '../../utils';
import { MENU_ITEMS } from '../../../../public/data/menu-items';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { DesktopSidebarComponent } from '../desktop-sidebar/desktop-sidebar.component';
import { MobileSidebarComponent } from '../mobile-sidebar/mobile-sidebar.component';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, TooltipModule, ButtonModule, MenuModule, MenubarModule, DesktopSidebarComponent, MobileSidebarComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ transform: 'translateX(-100%)', opacity: 0 }),
          stagger('0.05s', [
            animate('0.2s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('titleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('0.3s 0.6s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('0.15s ease-in', style({ opacity: 0, transform: 'translateX(-10px)' }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit, OnChanges, OnDestroy {
  menuItems: Array<MenuItem> = MENU_ITEMS;
  moreMenuItems: Array<any> = [];
  sideBarOpened: boolean = true;
  logoSrc: string = '/images/logo1.png';
  isMobile: boolean = false;
  isLoading: boolean = true;
  isTablet: boolean = false;
  isMoreMenuVisible: boolean = false;

  @ViewChild('moreMenu', { static: false }) moreMenu!: ElementRef;

  @Input() permissionList: any[] = [];
  readonly MENU_THRESHOLD = 7;
  isMoreMenuActive: boolean = false;

  constructor(
    private router: Router,
    private cdref: ChangeDetectorRef
  ) {

    effect(() => {
      this.permissionList = utils.permissionList();
    })

    effect(() => {
      this.isMobile = utils.isMobile();
      this.isTablet = utils.isTablet();
      if (utils.isPageRefreshed()) {
        const currentUrl = this.getCurrentUrl();
        currentUrl ? this.setActiveMenuItem(currentUrl) : this.setDefaultMenuItem();
      }
    }, { allowSignalWrites: true });

    effect(() => {
      this.sideBarOpened = utils.sideBarOpened();
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.router.events.subscribe((router) => {
      if (router instanceof NavigationEnd) {
        const currentUrl = this.getCurrentUrl();
        currentUrl ? this.setActiveMenuItem(currentUrl) : this.setDefaultMenuItem();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const data = changes['permissionList']?.currentValue;
    if (data) {
      this.filterMenuItems(data);
      this.splitMenuItems();
    }
  }

  filterMenuItems(data: any[]) {
    const filteredMenuItems = MENU_ITEMS.filter((menuItem: MenuItem) =>
      data.some(item => this.normalizeRoute(item.moduleName) === this.normalizeRoute(menuItem.moduleName) && item.canView)
    );
    this.menuItems = filteredMenuItems;
  }

  splitMenuItems() {
    if (this.menuItems.length > this.MENU_THRESHOLD) {
      const mainMenuItems = this.menuItems.slice(0, this.MENU_THRESHOLD);
      const moreMenuItems = this.menuItems.slice(this.MENU_THRESHOLD);

      this.moreMenuItems = moreMenuItems.map(item => ({
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

  createMoreMenuItem(moreItems: MenuItem[]): MenuItem {
    return {
      id: 21,
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

  resetActiveState(menuItems?: MenuItem[]) {
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

  setActiveMenuItem(route: string) {
    const normalizedRoute = this.normalizeRoute(route);
    this.resetActiveState(this.menuItems);
    this.resetActiveState(this.moreMenuItems);
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
        const menuItem = this.menuItems.find(item => this.normalizeRoute(item.route) === normalizedRoute);
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

  handleItemClick(item: MenuItem) {
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
  }

  handleMoreMenuItemClick(item: MenuItem) {
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
    if (this.menuItems.length > 0) {
      this.menuItems.forEach((each) => each.isActive = false);
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
      const moreMenuItem = this.moreMenuItems.find((each: MenuItem) => each.route.toLowerCase().trim().replace(/\s+/g, '') === trimmedRoute) ?? undefined;
      this.moreMenuItems.forEach((each, index) => each.isActive = false);
      if (moreMenuItem) {
        moreMenuItem.isActive = true;
      }
    }
  }

  closeSidebar(event: any) {
    utils.sideBarOpened.update(val => !val);
  }

  ngOnDestroy(): void {
    this.menuItems.forEach((menu: MenuItem) => menu.isActive = false);
  }
}
