import { Component, effect, ElementRef, Input, input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { utils } from '../../utils';
import { MENU_ITEMS } from '../../../../public/data/menu-items';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, TooltipModule, ButtonModule, MenuModule],
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

  @Input({ required: true }) permissionList: any[] = [];

  constructor(
    private router: Router
  ) {

    effect(() => {
      this.isMobile = utils.isMobile();
    })
    effect(() => {
      this.isTablet = utils.isTablet();
    })

    effect(() => {
      const isPageRefreshed = utils.isPageRefreshed();
      if (isPageRefreshed) {
        const currentUrl = this.router.url.split('/')[2];
        if (currentUrl) this.setActiveMenuItem(currentUrl);
        else {
          utils.activeItem.set(this.menuItems[0]);
          utils.setPageTitle(this.menuItems[0].title);
          this.menuItems[0].isActive = true;
        }
      }
    }, { allowSignalWrites: true })

    effect(() => {
      this.sideBarOpened = utils.sideBarOpened();
    })
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.router.events.subscribe((router) => {
      if (router instanceof NavigationEnd) {
        const currentUrl = router.url.split('/')[2];
        if (currentUrl) this.setActiveMenuItem(currentUrl);
        else {
          this.menuItems[0].isActive = true;
        }
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    const data = changes['permissionList'].currentValue;
    if (data) {
      const menuItems = MENU_ITEMS;
      const filteredMenuItems = menuItems.filter((menuItem: MenuItem) => {
        const matchedItem = data.find((item: any) => item.moduleName.trim().replace(/\s/g, '').toLowerCase() === menuItem.moduleName.trim().replace(/\s/g, '').toLowerCase() && item.canView);
        return matchedItem !== undefined;
      })
      if (filteredMenuItems.length) {
        this.menuItems = filteredMenuItems;
        if (this.menuItems.length > 7) {
          if (filteredMenuItems.length > 8 && (!this.isMobile || !this.isTablet)) {
            const superMenuItems = filteredMenuItems.slice(0, 9);
            const extraMenuItems = filteredMenuItems.slice(9);
            const moreMenuItem = {
              id: 17,
              title: 'More',
              label: 'More',
              moduleName: 'more',
              icon: 'pi pi-ellipsis-h',
              isActive: false,
              route: 'more',
              items: extraMenuItems
            }
            this.menuItems = superMenuItems;
            this.menuItems.push(moreMenuItem);
            this.moreMenuItems = extraMenuItems.map((item: any) => {
              item['label'] = item?.title;
              item['command'] = (event: any) => {
                this.handleMoreMenuItemClick(item);
              }
              return item;
            });
          }

        }
        const currentUrl = this.router.url.split('/')[2];
        if (currentUrl) this.setActiveMenuItem(currentUrl);
        else {
          this.menuItems[0].isActive = true;
        }
      }
    }
  }

  toggleMoreMenu() {
    this.isMoreMenuVisible = !this.isMoreMenuVisible;
  }

  handleItemClick(item: MenuItem) {
    if (item.moduleName !== 'more') {
      utils.activeItem.set(item);
      utils.setPageTitle(item?.title);
      this.menuItems.forEach((menu: MenuItem) => menu.isActive = false);
      if (item?.id === 1) {
        this.router.navigateByUrl('app');
      } else {
        this.router.navigateByUrl('app/' + item.route);
      }
      item.isActive = true;
      utils.menuItemClick.set(item);
    } else {
      this.toggleMoreMenu();
    }
  }

  handleMoreMenuItemClick(item: any) {
    this.handleItemClick(item);
  }

  setActiveMenuItem(route: string) {
    this.menuItems.forEach((menu: MenuItem) => menu.isActive = false);
    const currentItemIndex = this.menuItems.findIndex((item) => item?.route === route);
    if (currentItemIndex > -1) {
      utils.activeItem.set(this.menuItems[currentItemIndex]);
      utils.setPageTitle(this.menuItems[currentItemIndex].title);
      this.menuItems[currentItemIndex].isActive = true;
    }
  }

  closeSidebar(event: any) {
    utils.sideBarOpened.update(val => !val);
  }

  ngOnDestroy(): void {
    this.menuItems.forEach((menu: MenuItem) => menu.isActive = false);
  }
}
