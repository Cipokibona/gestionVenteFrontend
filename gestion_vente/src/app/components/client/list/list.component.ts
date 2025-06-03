import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-list',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit{
  
  customers!: any;
  allVentes!: any;
  venteCreditClient!: any;

  userData!: any;

  loadingPage!: boolean;
  error!: string | null;

  clientForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    poste: new FormControl('', Validators.required),
    role: new FormControl('agent', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiServiceService) {
  }

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getCustomers();
    this.getAllVente();
    this.getCreditVenteClient();
  }

  getUserData(){
    this.apiService.currentUser.subscribe({
      next: (data) => {
        this.userData = data;
        console.log('userDAta', this.userData);
      },
      error: (err) => {
        console.error('erreur de recuperation de dataUser',err);
      }
    })
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

  createClient(){}
}
