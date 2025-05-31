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
import { ToAgentComponent } from './components/product/to-agent/to-agent.component';
import { ToPointOfSellComponent } from './components/product/to-point-of-sell/to-point-of-sell.component';
import { ListPOSComponent } from './components/pointOfSell/list-pos/list-pos.component';
import { ListAllVenteComponent } from './components/vente/list-all-vente/list-all-vente.component';
import { ListPosteComponent } from './components/poste/list-poste/list-poste.component';
import { ListTypeEchangeComponent } from './components/wallet/list-type-echange/list-type-echange.component';

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
        path: 'client/vente/:id',
        title: 'vente client page',
        component: SellComponent,
    },
    {
        path: 'vente',
        title: 'vente page',
        component: ListAllVenteComponent,
    },
    {
        path: 'achat',
        title: 'achat page',
        component: BuyComponent,
    },
    {
        path:'approvisionnementAgent',
        title: 'approvisionnement Agent page',
        component: ToAgentComponent,
    },
    {
        path:'approvisionnementPOS',
        title: 'approvisionnement POS page',
        component: ToPointOfSellComponent,
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
    {
        path:'listPOS',
        title: 'list POS page',
        component: ListPOSComponent,
    },
    {
        path:'listPoste',
        title: 'list poste page',
        component: ListPosteComponent,
    },
    {
        path:'listTypeEchange',
        title:'type echange page',
        component:ListTypeEchangeComponent
    }
];
