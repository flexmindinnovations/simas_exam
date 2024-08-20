export interface MenuItem {
    id: number;
    title: string;
    moduleName: string;
    icon: string;
    isActive: boolean;
    route: string;
    label?: string;
    items?: Array<MenuItem>;
}