import { Routes } from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { LayoutComponent } from "./layout.component";
import { NotFoundComponent } from "../not-found/not-found.component";

export const layoutRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: '**',
                component: NotFoundComponent
            }
        ]
    }
]