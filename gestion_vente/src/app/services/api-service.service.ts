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
  private productsBasketUrl = `${this.url}basketAgent/`;
  private customerUrl = `${this.url}customers/`;
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

  getTransaction(){
    return this.http.get(`${this.transactionUrl}`);
  }

  createTransaction(data: any){
    const token = this.getTokenLocal();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    return this.http.post<any>(`${this.transactionUrl}`, data, {headers});
  }

  getProductBasket(){
    return this.http.get(`${this.productsBasketUrl}`);
  }

  getAllCustomers(){
    return this.http.get(`${this.customerUrl}`);
  }

  getCustomer(id: any){
    return this.http.get(`${this.customerUrl}${id}/`);
  }

  getAgentBasketId(id: any){
    return this.http.get(`${this.productsBasketUrl}${id}/`);
  }
}
