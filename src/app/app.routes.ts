import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';

const isLoggedIn = () => {
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // const hasUserObj = user && typeof user === 'object' && Object.keys(user).length > 0;
    // return hasUserObj && !!localStorage.getItem('token');
    return !!localStorage.getItem('token');
}

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'app',
        pathMatch: 'full'
    },
    {
        path: 'app',
        loadChildren: () => import('./pages/layout/layout.routes').then(m => m.layoutRoutes)
    },
    {
        path: 'login',
        component: LoginComponent
    }
];
