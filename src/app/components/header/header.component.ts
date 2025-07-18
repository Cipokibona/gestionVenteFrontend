import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    'ngSkipHydration': 'true'
  }
})
export class HeaderComponent {
  logo: string = 'assets/icons/favicon.ico';
  isAuthenticate!: any;
  userData!: any;

  constructor(private apiService: ApiServiceService){
    this.apiService.currentIsAuthenticate.subscribe({
      next: (data) => {
        this.isAuthenticate = data;
        console.log('etat de isauth', this.isAuthenticate);
      }
    });
    this.apiService.currentUser.subscribe({
      next: (data:any) => {
        this.userData = data;
        console.log('userdata dans header',this.userData)
      },
      error: (err) => {
        this.logout()
      }
    })
  }

  logout(){
    this.apiService.logout();
    this.apiService.updateAuth(false);
  }
}
