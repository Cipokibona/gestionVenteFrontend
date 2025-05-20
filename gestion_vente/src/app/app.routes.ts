import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/client/list/list.component';
import { SellComponent } from './components/product/sell/sell.component';
import { ListUserComponent } from './components/user/list-user/list-user.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';

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
    },
    {
        path: 'userList',
        title: 'list user',
        component: ListUserComponent,
    },
    {
        path:'user/:id',
        title: 'user edit',
        component: EditUserComponent,
    },
];
