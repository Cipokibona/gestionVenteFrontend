import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-basket',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-basket.component.html',
  styleUrl: './create-basket.component.scss'
})
export class CreateBasketComponent implements OnInit{
  userData!: any;
  allUserData!: any;

  agentId!: any;
  allAgent!: any;

  posRespoData!: any;
  allPos!: any;

  allProductPos!: any;

  selectedPosId!: any;
  selectedPosData!: any;
  
  nbreProducts: number = 1;
  tabProducts: any[] = [{ id: null, product_name: '' }];
  
  selectedProductId!: number;
  selectedProductData!: any;

  basketForm: FormGroup;

  constructor(private apiService: ApiServiceService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder){
    this.basketForm = this.fb.group({
      agent: this.fb.control('', Validators.required),
      depot: this.fb.control('', Validators.required),
      list_product: this.fb.array([], Validators.required),
      newProduct: this.fb.group({
        id: new FormControl('', Validators.required),
        product_name: new FormControl('', Validators.required),
        quantity: new FormControl('', Validators.required),
        prixOfficiel: new FormControl('', Validators.required),
        prixClient: new FormControl('', Validators.required)
      }),
    });
  }

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getPos();
    this.getAllAgent();
    console.log('venteForm', this.basketForm.value);
  }

  getPos(){
    this.apiService.getAllPos().subscribe({
      next: (dataAllPos: any) => {
        this.allPos = dataAllPos.results;
        console.log('pos du allpos', this.allPos);
        for(let data of this.allPos){
          let i = data.list_respo.find((item:any) => item.respo === this.userData.id);
          if(i){
            this.posRespoData = data;
          }
        }
        // this.posRespoData = this.allPos.list_respo.find((item:any) => item.respo === this.userData.id);
        console.log('pos du userId', this.posRespoData);
        this.selectedPosData = this.posRespoData;
        this.getAllProductPos();
      },
      error: (err) => {
        console.error('erreur de recuperation de pos', err);
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

  getAllAgent(){
    this.apiService.getAllUser().subscribe({
      next: (data:any) => {
        const allUser = data.results;
        this.allAgent = allUser.filter((item:any) => item.is_agent_commercial === true);
        console.log('userDAta', this.allAgent);
      },
      error: (err) => {
        console.error('erreur de recuperation de dataUser',err);
      }
    })
  }

  getAllProductPos(){
    this.apiService.getAllProductPos().subscribe({
      next: (data:any) => {
        const allProductPos = data.results;
        console.log('all product pos', allProductPos);
        this.allProductPos = allProductPos.filter((item:any) => item.pos == this.selectedPosData.id);
        console.log('product for this pos', this.allProductPos);
      },
      error: (err) => {
        console.error('erreur de recuperation de product pos',err);
      }
    })
  }

  selectPos(event: Event){
    this.selectedPosId = Number((event.target as HTMLSelectElement).value);
    this.selectedPosData = this.allPos.find((item:any) => item.id === this.selectedPosId);
    console.log('selected pos', this.selectedPosData);
  }

  selectProduct(event: Event){
    this.selectedProductId = Number((event.target as HTMLSelectElement).value);
    this.selectedProductData = this.selectedPosData.list_product.find((item:any) => item.product === this.selectedProductId);
    
    console.log('selected product data', this.selectedProductData);
    
  }

  selectAgent(event: Event){
    this.agentId = Number((event.target as HTMLSelectElement).value);
    
    console.log('selected agent id', this.agentId)
  }

  // recuperations des info dans le form
  get listProduct(): FormArray {
    return this.basketForm.get('list_product') as FormArray;
  }

  // get listTypeEchange(): FormArray {
  //   return this.venteForm.get('typeEchange') as FormArray;
  // }

  get newProduct(): FormGroup {
    return this.basketForm.get('newProduct') as FormGroup;
  }

  // get newTypeEchange(): FormGroup {
  //   return this.venteForm.get('newTypeEchange') as FormGroup;
  // }

  // get typeEchange(): FormArray {
  //   return this.venteForm.get('typeEchange') as FormArray;
  // }

  addProductByForm() {
    this.listProduct.push(this.fb.group({
      id: this.selectedProductId,
      product_name: this.selectedProductData.product_name,
      quantity: new FormControl(this.newProduct.value.quantity, Validators.required),
      pricePerUnitOfficiel: this.selectedProductData.prixVente,
      date_expiration: this.selectedProductData.date_expiration,
    }));

    // Réinitialiser le FormGroup pour le nouveau produit
    this.newProduct.reset();
    console.log('list des products dans form', this.listProduct.value);
  }

  createPanier(){
    console.log(this.basketForm.value);
    const data = {
      agent: this.agentId,
      depot: this.selectedPosData.id,
    }
    this.apiService.createBasket(data).subscribe({
      next: (data:any) => {
        console.log('basket enregistrer', data);
        const requests = [];
        for(let product of this.listProduct.value){
          const dataProduct = {
            basket: data.id,
            product: product.id,
            quantity: product.quantity,
            pricePerUnitOfficiel: product.pricePerUnitOfficiel,
            date_expiration: product.date_expiration
          };
          const request = this.apiService.createListBasket(dataProduct);
          requests.push(request);
          // update product dans pos
          const productPos = this.allProductPos.find(
            (item:any) => item.product == product.id && item.prixVente == product.pricePerUnitOfficiel && item.date_expiration == product.date_expiration
          );
          console.log('produit a modifier', product);
          const newQuantity = productPos.quantity - product.quantity;
          const newDataProduct = {
            quantity: newQuantity,
          }
          const requestUpdate = this.apiService.updateProductPos(productPos.id,newDataProduct);
          requests.push(requestUpdate);
        };

        forkJoin(requests).subscribe({
          next: (resp:any) => {
            this.router.navigate(['/liste_panier']);
            console.log('creation reussi', resp);
          },
          error: (err) => {
            this.apiService.deleteBasket(data.id);
            console.error('erreur de creation et suppression de basket', err);
          }
        });
      },
      error: (err) => {
        console.error('erreur de creation de basket', err);
      }
    });
    console.log('data a envoyer', data);
  }

  pourcentage(qte: number, max: number){
    const newMax = (100 * qte)/max;
    return newMax
  }
}
