import { signal } from "@angular/core";

export const utils = {
    domain: 'Simas Academy',
    menuItemClick: signal<any>({}),
    isMobile: signal<boolean>(false),
    isTablet: signal<boolean>(false),
    isPageRefreshed: signal<boolean>(false),
    sideBarOpened: signal<boolean>(true)
}