import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  // private storedUser = localStorage.getItem('user');
  private user$ = new BehaviorSubject<string | null>(null);
  private isAuthenticate$ = new BehaviorSubject<string | null>(null);
  private typeEchange$ = new BehaviorSubject<string | null>(null);
  
  currentUser = this.user$.asObservable();
  currentIsAuthenticate = this.isAuthenticate$.asObservable();
  currentTypeEchange = this.typeEchange$.asObservable()


  private http = inject(HttpClient);

  private token: string | null = null;

  private url = 'http://127.0.0.1:8000/api/';

  private usersUrl = `${this.url}users/`;
  private tokenUrl = `${this.url}token/`;
  private transactionUrl = `${this.url}transactions/`
  private walletUrl = `${this.url}wallet/`
  private typeEchangeUrl = `${this.url}typeEchange/`
  private basketAgentUrl = `${this.url}basketAgent/`;
  private customerUrl = `${this.url}customers/`;
  private ventesUrl = `${this.url}ventes/`;
  private posteUrl = `${this.url}poste/`;
  private salarUrl = `${this.url}salaire/`;
  private tauxEchangeUrl = `${this.url}tauxEchange/`;
  private distributeurUrl = `${this.url}distributeur/`;
  private productUrl = `${this.url}product/`;
  private posUrl = `${this.url}pointVente/`;
  private responsablePosUrl = `${this.url}respoPos/`;

  private listProductVenteUrl = `${this.url}list_product_vente/`;
  private listPayVenteUrl = `${this.url}list_pay_vente/`;

  private tokenRefreshUrl = `${this.url}token/refresh/`;

  constructor(private router: Router) {  }

  login(credentials: { username: string; password: string }): Observable<any> {
    if(this.token){
      this.logout();
    }
    return this.http.post<any>(`${this.tokenUrl}`, credentials);
  }

  logout(){
    this.token = null;
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    this.router.navigate(['/login']).then(() => {
        location.reload();
    });
  }

  updateAuth(data: any){
    this.isAuthenticate$.next(data);
  }

  getUser(userId: number, token: any): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    
    return this.http.get(`${this.usersUrl}${userId}/`, {headers});
  }

  updateUser(data: any){
    this.user$.next(data);
    localStorage.setItem('user', JSON.stringify(data));
  }

  updateTypeEchange(data: any){
    this.typeEchange$.next(data);
  }

  saveToken(token: any){
    localStorage.setItem('jwt', JSON.stringify(token));
  }

  getTokenLocal(): any | null {
    const data = localStorage.getItem('jwt');
    if(data){
      return JSON.parse(data);
    }else{
      return null;
    }
  }

  refreshTokenLocal() {
    const tokenLocal = this.getTokenLocal();
    if (tokenLocal){
      const data = {
        'refresh' : `${tokenLocal.refresh}`,
      };
      this.http.post<any>(`${this.tokenRefreshUrl}`, data).subscribe({
        next: (resp) => {
          this.updateTokenLocal(resp.access);
          console.log('recuperation de token avec success', resp);
        },
        error: (err) => {
          console.error(`Erreur de refresh de ${tokenLocal.refresh}`, err);
          // this.logout();
        }
      });
    }
  }

  updateTokenLocal(data: any) {
    const tokenLocal = this.getTokenLocal();
    if(tokenLocal){
      tokenLocal.access = data;
      this.saveToken(tokenLocal);
    }
  }

  updateUserLocal(){
    const tokenLocal = this.getTokenLocal();
    if (tokenLocal){
      const decodeToken = jwtDecode<any>(tokenLocal.access);
      this.getUser(decodeToken.user_id, tokenLocal).subscribe({
        next: (data) => {
          this.updateUser(data);
          this.updateAuth(true);
        }
      })
    }else{
      this.logout();
    }
  }

  getWallet(){
    return this.http.get(`${this.walletUrl}`)
  }

  createWallet(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.walletUrl}`, data, {headers});
  }

  updateWallet(id: any, data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.patch<any>(`${this.walletUrl}${id}/`, data, {headers});
  }

  getTypeEchange(){
    return this.http.get(`${this.typeEchangeUrl}`)
  }

  createTypeEchange(data:any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.typeEchangeUrl}`, data, {headers});
  }

  editTypeEchange(id:number, data:any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.patch<any>(`${this.typeEchangeUrl}${id}/`, data, {headers});
  }
  deleteTypeEchange(id:number){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.delete<any>(`${this.typeEchangeUrl}${id}/`, {headers});
  }

  createTauxEchange(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.tauxEchangeUrl}`, data, {headers});
  }

  getTransaction(){
    return this.http.get(`${this.transactionUrl}`);
  }

  createTransaction(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.transactionUrl}`, data, {headers});
  }

  getBasketAgent(){
    return this.http.get(`${this.basketAgentUrl}`);
  }
  
  getAllUser(){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.get<any>(`${this.usersUrl}`, {headers});
  }

  createUser(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.usersUrl}`, data, {headers});
  }

  deleteUser(id: number){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.delete<any>(`${this.usersUrl}${id}/`, {headers});
  }

  getAllCustomers(){
    return this.http.get(`${this.customerUrl}`);
  }

  getCustomer(id: any){
    return this.http.get(`${this.customerUrl}${id}/`);
  }

  getAgentBasketId(id: any){
    return this.http.get(`${this.basketAgentUrl}${id}/`);
  }

  getAllVente(){
    return this.http.get(`${this.ventesUrl}`);
  }

  createVente(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.ventesUrl}`, data, {headers});
  }

  deleteVente(id:number){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.delete<any>(`${this.ventesUrl}${id}/`, {headers});
  }

  createListProductVente(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.listProductVenteUrl}`, data, {headers});
  }

  createListPayVente(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.listPayVenteUrl}`, data, {headers});
  }

  getAllPoste(){
    return this.http.get(`${this.posteUrl}`);
  }

  createPoste(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.posteUrl}`, data, {headers});
  }

  editPost(id:number, data:any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.patch<any>(`${this.posteUrl}${id}/`, data, {headers});
  }

  getAllSalar(){
    return this.http.get(`${this.salarUrl}`);
  }

  createSalar(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.salarUrl}`, data, {headers});
  }

  getAllDistributeur(){
    return this.http.get(`${this.distributeurUrl}`);
  }

  createDistributeur(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.distributeurUrl}`, data, {headers});
  }

  createProduct(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.productUrl}`, data, {headers});
  }

  getAllPos(){
    return this.http.get(`${this.posUrl}`);
  }

  createPos(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.posUrl}`, data, {headers});
  }

  createResponsablePos(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.responsablePosUrl}`, data, {headers});
  }
  
}
