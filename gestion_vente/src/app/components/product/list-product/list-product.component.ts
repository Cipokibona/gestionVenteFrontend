import { Component } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-product',
  imports: [CommonModule],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss'
})
export class ListProductComponent {

  basketUser!: any;
  userData!: any;

  constructor(private apiService: ApiServiceService){
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
    this.getProductAgent();
  }

  getProductAgent(){
    this.apiService.getProductBasket().subscribe({
      next: (dataBasketAgent: any) => {
        const data = dataBasketAgent.results;
        this.basketUser = data.filter((item:any) => item.agent === this.userData.id);
        console.log('basket pour les users', this.basketUser);
      },
      error: (err) => {
        console.error('erreur de recuperation de basket', err);
      }
    })
  }

  getUser(){
    this.apiService.currentUser.subscribe({
      next: (data) => {
        this.userData = data;
        console.log('userData dans list_product page:', this.userData);
      }
    });
  }
}
