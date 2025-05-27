import { Component } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  customers!: any;

  constructor(private apiService: ApiServiceService) {
    this.getCustomers();
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
}
