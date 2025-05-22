import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  logo: string = 'assets/icons/favicon.ico';
  isAuthenticate!: any;

  constructor(private apiService: ApiServiceService){
    this.apiService.currentIsAuthenticate.subscribe({
      next: (data) => {
        this.isAuthenticate = data;
        console.log('etat de isauth', this.isAuthenticate);
      }
    });
  }

  logout(){
    this.apiService.logout();
    this.apiService.updateAuth(false);
  }
}
