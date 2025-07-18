import { Component } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss'
})
export class ListProductComponent {

  basketUser!: any;
  userData!: any;
  distributeurs!: any;

  loading!: boolean;
  error!: '';

  distributeurForm = new FormGroup({
    name: new FormControl('', Validators.required),
    adress: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
  });

  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiServiceService){
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
    this.getProductAgent();
    this.getAllDistributeur();
  }

  getProductAgent(){
    this.apiService.getBasketAgent().subscribe({
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

  getAllDistributeur(){
    this.apiService.getAllDistributeur().subscribe({
      next: (dataDistributeur: any) => {
        this.distributeurs = dataDistributeur.results;
        console.log('distributeurs', this.distributeurs);
      },
      error: (err) => {
        console.error('erreur de recuperation de distributeur', err);
      }
    })
  }

  createDistributeur(){
    const data = {
      name: this.distributeurForm.value.name,
      adress: this.distributeurForm.value.adress,
      tel: this.distributeurForm.value.tel
    };
    this.apiService.createDistributeur(data).subscribe({
      next: (data:any) => {
        console.log('creation reussi de distributeur', data);
      },
      error: (err) => {
        console.error('erreur de creation de distributeur',err)
      }
    });
    location.reload();
  }

  createProduct(id:number){
    const data = {
      distributeur: Number(id),
      name: this.productForm.value.name,
      description: this.productForm.value.description,
    };
    this.apiService.createProduct(data).subscribe({
      next: (data:any) => {
        console.log('creation reussi de product', data);
      },
      error: (err) => {
        console.error('erreur de creation de product',err)
      }
    });
    location.reload();
  }
}
