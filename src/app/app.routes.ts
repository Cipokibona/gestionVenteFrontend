import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/client/list/list.component';
import { SellComponent } from './components/product/sell/sell.component';
import { ListUserComponent } from './components/user/list-user/list-user.component';
import { TransactionComponent } from './components/wallet/transaction/transaction.component';
import { ListProductComponent } from './components/product/list-product/list-product.component';
import { BuyComponent } from './components/product/buy/buy.component';
import { ListPOSComponent } from './components/pointOfSell/list-pos/list-pos.component';
import { ListAllVenteComponent } from './components/vente/list-all-vente/list-all-vente.component';
import { ListPosteComponent } from './components/poste/list-poste/list-poste.component';
import { ListTypeEchangeComponent } from './components/wallet/list-type-echange/list-type-echange.component';
import { ListBasketsComponent } from './components/product/list-baskets/list-baskets.component';
import { CreateBasketComponent } from './components/product/create-basket/create-basket.component';
import { FormRecouvrementComponent } from './components/client/form-recouvrement/form-recouvrement.component';
import { ListReceptionComponent } from './components/pointOfSell/list-reception/list-reception.component';
import { ToolsForUserComponent } from './components/user/tools-for-user/tools-for-user.component';
import { ListDepensesComponent } from './components/depenses/list-depenses/list-depenses.component';
import { CaisseBordereauComponent } from './components/caisse-bordereau/caisse-bordereau.component';
import { ListRequestComponent } from './components/pointOfSell/list-request/list-request.component';
import { RenderMode } from '@angular/ssr';
import { FacturesVentesComponent } from './components/factutes/factures-ventes/factures-ventes.component';


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
        path: 'client/vente/:id',
        // renderMode: RenderMode.Server,
        title: 'vente client page',
        component: SellComponent,
    },
    {
        path: 'client/recouvrement/:id',
        title: 'recouvrement page',
        component: FormRecouvrementComponent,
    },
    {
        path: 'vente',
        title: 'vente page',
        component: ListAllVenteComponent,
    },
    {
        path: 'listPOS/approvisionnementPOS/:id',
        title: 'achat page',
        component: BuyComponent,
    },
    {
        path:'liste_panier',
        title: 'Panier Agent page',
        component: ListBasketsComponent,
    },
    {
        path:'liste_request',
        title: 'Request page',
        component: ListRequestComponent,
    },
    {
        path:'create_panier',
        title: 'Create Agent page',
        component: CreateBasketComponent,
    },
    {
        path: 'userList',
        title: 'list user',
        component: ListUserComponent,
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
    },
    {
        path:'reception',
        title:'reception page',
        component:ListReceptionComponent
    },
    {
        path:'tools',
        title:'tools page',
        component:ToolsForUserComponent
    },
    {
        path:'depenses',
        title:'depenses page',
        component:ListDepensesComponent
    },
    {
        path:'home/bordereau/:id',
        title:'liste bordereau page',
        component:CaisseBordereauComponent
    },
    {
        path:'facture/:id',
        title:'facture page',
        component:FacturesVentesComponent
    }
];
