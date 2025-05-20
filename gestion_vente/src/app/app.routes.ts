import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/client/list/list.component';
import { SellComponent } from './components/product/sell/sell.component';

export const routes: Routes = [
    { 
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path:'login',
        title: 'Login Page',
        component: LoginComponent,
    },
    {
        path:'home',
        title: 'Home Page',
        component: HomeComponent,
    },
    {
        path: 'client',
        title: 'client page',
        component: ListComponent,
    },
    {
        path: 'vente',
        title: 'vente page',
        component: SellComponent,
    }
];
