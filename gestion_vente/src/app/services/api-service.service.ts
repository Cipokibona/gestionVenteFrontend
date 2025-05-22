import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private storedUser = localStorage.getItem('user');
  public user$ = new BehaviorSubject<string | null>(this.storedUser ? JSON.parse(this.storedUser) : null);
  
  currentUser = this.user$.value;

  private http = inject(HttpClient);

  private token: string | null = null;

  private url = 'http://127.0.0.1:8000/api/';

  private usersUrl = `${this.url}users/`;
  private tokenUrl = `${this.url}token/`;
  private tokenRefreshUrl = `${this.url}token/refresh/`;

  constructor(private router: Router) { }

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
    this.router.navigate(['/login']);
  }

   getUser(userId: number, token: any): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access}`);
    
    return this.http.get(`${this.usersUrl}${userId}/`, {headers});
  }

  updateUser(data: any){
    this.user$.next(data);
    localStorage.setItem('user', JSON.stringify(data));
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
}
