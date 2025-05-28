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
  
  typeEchangeData!: any;
  
  agentBasket!: any;
  
  nbreProducts: number = 1;
  tabProducts: any[] = [{ id: null, product_name: '' }];

  nbreModePay: number = 1;
  tabModePay: any[] = [{ id: null, modePayName: '' }];
  
  selectedBasketId!: number;
  selectedBasketData!: any;
  
  selectedProductId!: number;
  selectedProductData: any[] = [];
  
  selectedTypeId!: number;
  selectedTypeData: any[] = [];

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
    this.getTypeEchange();
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

  getTypeEchange(){
    this.apiService.getTypeEchange().subscribe({
      next: (dataEchange:any) => {
        this.typeEchangeData = dataEchange.results;
        console.log('type echange', this.typeEchangeData);
      },
      error: (err) => {
        console.error('erreur de recuperation de type echange', err);
      }
    })
  }

  // updateTabProduct(){
  //   this.tabProducts = Array.from({
  //     length: this.nbreProducts
  //   });
  // }

  addProduct(data: any, index: number){
    const newProduct = {
      ...data,
      id: Number(index) 
    };
    this.tabProducts.push(newProduct);
    console.log('ajout de data', this.tabProducts);
  }

  removeProduct(data:any){
    if(this.tabProducts.length > 1){
      this.tabProducts.splice(data, 1);
    }
    console.log('resultat aprs suppression de product dans vente', this.tabProducts);
  }

  // updateTabModePay(){
  //   this.tabModePay = Array.from({
  //     length: this.nbreModePay
  //   });
  // }

  addModePay(data: any, index: number){
    const newModePay = {
      ...data,
      id: Number(index) 
    };
    this.tabModePay.push(newModePay);
    console.log('ajout de data type', this.tabModePay);
  }

  removeModePay(index:number){
    if(this.tabModePay.length > 1){
      this.tabModePay.splice(index,1);
    }
  }

  selectBasket(event: Event){
    this.selectedBasketId = Number((event.target as HTMLSelectElement).value);
    this.selectedBasketData = this.agentBasket.find((item:any) => item.id === this.selectedBasketId);
    console.log('selected Basket', this.selectedBasketData);
  }

  selectProduct(event: Event, index:number){
    this.selectedProductId = Number((event.target as HTMLSelectElement).value);
    const dataSelectedProduct = this.selectedBasketData.list_product.find((item:any) => item.id === this.selectedProductId);
    const dataPutIndex = {
      ...dataSelectedProduct,
      id: Number(index) // Définir un nouvel ID
    };
    this.selectedProductData.push(dataPutIndex);
    console.log('selected product data', this.selectedProductData);
    

    // Vérification de l'index existant
    // const existingIndex = this.tabProducts.find(item => item.id === Number(index));
    // console.log('index existant', existingIndex);

    // if (existingIndex) {
    //   // Supprimer tous les éléments à partir de l'index existant
    //   this.tabProducts.splice(index); 
    // }

    // Suppression des produits avec ID null
    // const idNullIndex = this.tabProducts.find(product => product.id === null);
    // if (idNullIndex) {
    //   this.tabProducts.splice(idNullIndex); // Supprime l'élément avec ID null
    // }

    // Création du nouveau produit
    // const newProduct = {
    //   ...this.selectedProductData,
    //   id: Number(index) // Définir un nouvel ID
    // };
    // this.tabProducts.push(newProduct);
    // this.selectedProductData = this.selectedBasketData.find((item:any) => item.id === this.selectedProductId);
    console.log('selected product', this.selectedProductData)
    
  }

  selectedTypeEchange(event: Event, index: number){
    this.selectedTypeId = Number((event.target as HTMLSelectElement).value);
    const dataPay = this.typeEchangeData.find((item:any) => item.id === this.selectedTypeId);
    // const existIndex = this.selectedTypeData.find((item:any) => item.id === index);
    // if(existIndex){
    //   this.selectedTypeData.slice(index,1);
    // };
    const datePayIndex = {
      ...dataPay,
      id: Number(index)
    };
    this.selectedTypeData.push(datePayIndex);
    // this.selectedProductData = this.selectedBasketData.find((item:any) => item.id === this.selectedProductId);
    console.log('selected type', this.selectedTypeData)
  }
  
}
