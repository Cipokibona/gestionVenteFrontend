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

  constructor(private apiService: ApiServiceService){}

  logout(){
    this.apiService.logout();
  }
}
