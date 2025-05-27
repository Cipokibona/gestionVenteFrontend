import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sell',
  imports: [],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.scss'
})
export class SellComponent implements OnInit{
  userData!: any;
  idClient!: any;
  dataClient!: any;
  agentBasket!: any;
  nbreProducts: number = 1;
  tabProducts: any[] = [];
  selectedBasketId!: number;
  selectedBasketData!: any;

  constructor(private apiService: ApiServiceService, private router: Router, private route: ActivatedRoute){
    
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.idClient = +params['id'];
        this.apiService.getCustomer(this.idClient).subscribe({
          next: (dataClient:any) => {
            this.dataClient = dataClient;
            console.log('data du client', this.dataClient);
          },
          error: (err) => {
            console.error('erreur de recuperation du data', err);
          }
        })
      }
    );
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getBasketAgent();
    this.updateTabProduct();
  }

  getBasketAgent(){
    this.apiService.getProductBasket().subscribe({
      next: (dataBasketAgent: any) => {
        this.agentBasket = dataBasketAgent.results.filter((item:any) => item.agent === this.userData.id);
        console.log('basket agent', this.agentBasket);
      },
      error: (err) => {
        console.error('erreur de recuperation de basketAgent', err);
      }
    })
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

  updateTabProduct(){
    this.tabProducts = Array.from({
      length: this.nbreProducts
    });
  }

  addProduct(){
    this.nbreProducts++;
    this.updateTabProduct();
  }

  removeProduct(){
    if(this.nbreProducts > 1){
      this.nbreProducts--;
      this.updateTabProduct();
    }
  }

  selectBasket(event: Event){
    this.selectedBasketId = Number((event.target as HTMLSelectElement).value);
    this.selectedBasketData = this.agentBasket.find((item:any) => item.id === this.selectedBasketId);
    console.log('selected Basket', this.selectedBasketData);
  }
  
}
