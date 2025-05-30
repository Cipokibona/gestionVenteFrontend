import { Component } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-all-vente',
  imports: [CommonModule],
  templateUrl: './list-all-vente.component.html',
  styleUrl: './list-all-vente.component.scss'
})
export class ListAllVenteComponent {

  allVente!: any;

  constructor(private apiService: ApiServiceService){
    this.getAllVente();
  }

  getAllVente(){
    this.apiService.getAllVente().subscribe({
      next: (data:any) => {
        this.allVente = data.results;
        console.log('liste de vente', this.allVente);
      },
      error: (err) => {
        console.error('erreur de recuperation de vente',err)
      }
    })
  }

  getTotalPrice(data:any): number {
    return data.reduce((sum: number, article: { pricePerUnitClient: number; quantity: number; }) => sum + (article.pricePerUnitClient * article.quantity), 0);
  }

  getTotalPaye(data:any): number {
    return data.reduce((sum: number, article: { montant: number }) => sum + article.montant, 0);
  }
}
