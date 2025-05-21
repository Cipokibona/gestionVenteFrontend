import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/client/list/list.component';
import { SellComponent } from './components/product/sell/sell.component';
import { ListUserComponent } from './components/user/list-user/list-user.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { TransactionComponent } from './components/wallet/transaction/transaction.component';
import { EditClientComponent } from './components/client/edit-client/edit-client.component';
import { ListProductComponent } from './components/product/list-product/list-product.component';
import { BuyComponent } from './components/product/buy/buy.component';

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
        path: 'client/:id',
        title: 'edit client',
        component: EditClientComponent,
    },
    {
        path: 'vente',
        title: 'vente page',
        component: SellComponent,
    },
    {
        path: 'achat',
        title: 'achat page',
        component: BuyComponent,
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
    {
        path:'transactionForm',
        title: 'transaction form',
        component: TransactionComponent,
    },
    {
        path:'listProduct',
        title: 'list products page',
        component: ListProductComponent,
    },
];
