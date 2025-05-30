import { Component } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  customers!: any;
  allVentes!: any;
  venteCreditClient!: any;

  constructor(private apiService: ApiServiceService) {
    this.getCustomers();
    this.getAllVente();
    this.getCreditVenteClient();
  }

  getCustomers(){
    this.apiService.getAllCustomers().subscribe({
      next: (dataCustomer: any) => {
        this.customers = dataCustomer.results;
        console.log('list des clients', this.customers);
      },
      error: (err) => {
        console.error('erreur de recuperation', err);
      }
    })
  }

  getAllVente(){
    this.apiService.getAllVente().subscribe({
      next: (data:any) => {
        this.allVentes = data.results;
        console.log('all vente',this.allVentes)
      },
      error: (err) => {
        console.error('erreur de recuperation', err)
      }
    })
  }

  getCreditVenteClient(){
    this.venteCreditClient = this.allVentes.filter((item:any) => item.reste > 0);
    console.log('vente avec credit', this.venteCreditClient);
  }
}
