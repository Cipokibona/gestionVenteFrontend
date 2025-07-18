import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sell',
  imports: [ReactiveFormsModule, CommonModule],
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
  selectedProductData!: any;
  
  selectedTypeId!: number;
  selectedTypeData!: any;

  venteForm: FormGroup;

  totalReel: number = 0;
  totalPaye: number = 0;
  resteImpaye: number = 0;

  // loading
  loadingVente!: boolean;
  errorVente!: string | null;

  constructor(private apiService: ApiServiceService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder){
    this.venteForm = this.fb.group({
      panier: this.fb.control('', Validators.required),
      list_product: this.fb.array([], Validators.required),
      newProduct: this.fb.group({
        id: new FormControl('', Validators.required),
        product_name: new FormControl('', Validators.required),
        quantity: new FormControl('', Validators.required),
        prixOfficiel: new FormControl('', Validators.required),
        prixClient: new FormControl('', Validators.required)
      }),
      typeEchange: this.fb.array([], Validators.required),
      newTypeEchange: this.fb.group({
        id: new FormControl('', Validators.required),
        typeName: new FormControl('', Validators.required),
        montant: new FormControl('', Validators.required),
        bordereau: new FormControl('', Validators.required)
      }),
      dateRecouvrement:new FormControl('', Validators.required),
    });
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
    console.log('venteForm', this.venteForm.value);
  }

  getBasketAgent(){
    this.apiService.getBasketAgent().subscribe({
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

  removeProduct(data:any){
    if(this.tabProducts.length > 1){
      this.tabProducts.splice(data, 1);
    }
    console.log('resultat aprs suppression de product dans vente', this.tabProducts);
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

  selectProduct(event: Event){
    this.selectedProductId = Number((event.target as HTMLSelectElement).value);
    this.selectedProductData = this.selectedBasketData.list_product.find((item:any) => item.product === this.selectedProductId);
    
    console.log('selected product data', this.selectedProductData);
    
  }

  selectedTypeEchange(event: Event){
    this.selectedTypeId = Number((event.target as HTMLSelectElement).value);
    this.selectedTypeData = this.typeEchangeData.find((item:any) => item.id === this.selectedTypeId);
    
    console.log('selected type', this.selectedTypeData)
  }

  // recuperations des info dans le form
  get listProduct(): FormArray {
    return this.venteForm.get('list_product') as FormArray;
  }

  get listTypeEchange(): FormArray {
    return this.venteForm.get('typeEchange') as FormArray;
  }

  get newProduct(): FormGroup {
    return this.venteForm.get('newProduct') as FormGroup;
  }

  get newTypeEchange(): FormGroup {
    return this.venteForm.get('newTypeEchange') as FormGroup;
  }

  get typeEchange(): FormArray {
    return this.venteForm.get('typeEchange') as FormArray;
  }

  addProductByForm() {
    this.listProduct.push(this.fb.group({
      id: this.selectedProductId,
      product_name: this.selectedProductData.product_name,
      quantity: new FormControl(this.newProduct.value.quantity, Validators.required),
      pricePerUnitOfficiel: this.selectedProductData.pricePerUnitOfficiel,
      pricePerUnitClient: new FormControl(this.newProduct.value.prixClient, Validators.required)
    }));
    let newTotal = 0;
    for(let product of this.listProduct.value){
      newTotal += (product.pricePerUnitClient * product.quantity);
    };
    this.totalReel = newTotal;

    // Réinitialiser le FormGroup pour le nouveau produit
    this.newProduct.reset();
    console.log('list des products dans form', this.listProduct.value);
  }

  addTypeEchange() {
    this.listTypeEchange.push(this.fb.group({
      id: this.selectedTypeId,
      typeName: this.selectedTypeData.nom,
      montant: new FormControl(this.newTypeEchange.value.montant, Validators.required),
      bordereau: new FormControl(this.newTypeEchange.value.bordereau, Validators.required)
    }));

    let newPay = 0;
    for(let type of this.listTypeEchange.value){
      newPay += type.montant;
    }
    this.totalPaye = newPay;
    this.resteImpaye = this.totalReel - this.totalPaye;

    // Réinitialiser le FormGroup pour le nouveau produit
    this.newTypeEchange.reset();
    console.log('list des types dans form', this.venteForm.value);
  }

  createVente(){
    this.loadingVente = true;
    console.log(this.venteForm.value);
    const data = {
      client: this.dataClient.id,
      panier: this.venteForm.value.panier,
      // product_list: this.listProduct.value,
      // typeEchange_list: this.listTypeEchange.value,
      reste: this.resteImpaye,
      date_recouvrement: this.venteForm.value.dateRecouvrement || new Date().toISOString().split('T')[0],
    };
    this.apiService.createVente(data).subscribe({
      next: (data:any) => {
        console.log('vente enregistrer', data);
        const requests = [];
        for(let product of this.listProduct.value){
          const dataProduct = {
            vente: data.id,
            product: product.id,
            quantity: product.quantity,
            pricePerUnitOfficiel: product.pricePerUnitOfficiel,
            pricePerUnitClient: product.pricePerUnitClient
          }
          const request = this.apiService.createListProductVente(dataProduct);
          requests.push(request);
          // update de basket
          const productBasket = this.selectedProductData;
          console.log('product du basket',productBasket);
          const newQuantity = productBasket.quantity - product.quantity;
          let dataProductBasket!: any;
          //desactiver le produit basket si la qte est 0
          if(newQuantity == 0){
            dataProductBasket = {
              quantity: newQuantity,
              is_active: false
            };
          }else{
            dataProductBasket = {
              quantity: newQuantity,
            }
          };
          const requestUpdateProductBasket = this.apiService.updateProductBasket(productBasket.id,dataProductBasket);
          requests.push(requestUpdateProductBasket);
        };

        for(let pay of this.listTypeEchange.value){
          const dataPay = {
            vente: data.id,
            typeEchange: pay.id,
            montant: pay.montant,
            bordereau: pay.bordereau  || 'pas de bordereau',
          }
          const request = this.apiService.createListPayVente(dataPay);
          requests.push(request);
        };

        forkJoin(requests).subscribe({
          next: (resp:any) => {
            this.router.navigate(['/home']);
            console.log('creation reussi', resp);
          },
          error: (err) => {
            this.loadingVente = false;
            this.errorVente = 'Erreur vente';
            this.apiService.deleteVente(data.id);
            console.error('erreur de creation et suppression de vente', err);
          }
        });
      },
      error: (err) => {
        this.loadingVente = false;
        this.errorVente = 'Erreur vente';
        console.error('erreur de creation de vente', err);
      }
    });
    console.log('data a envoyer', data);
  }
  
}
