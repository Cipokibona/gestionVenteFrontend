import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buy',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './buy.component.html',
  styleUrl: './buy.component.scss'
})
export class BuyComponent implements OnInit{
  userData!: any;
  
  idPos!: any;
  dataPos!: any;

  selectedSource!: number;
  
  caisseData!: any;
  
  allPos!: any;
  allDistributeur!: any;
  
  nbreProducts: number = 1;
  tabProducts: any[] = [{ id: null, product_name: '' }];

  nbreModePay: number = 1;
  tabModePay: any[] = [{ id: null, modePayName: '' }];
  
  selectedPosId!: number;
  selectedPosData!: any;

  selectedDistrId!: number;
  selectedDistrData!: any;
  
  selectedProductId!: number;
  selectedProductData!: any;
  
  selectedCaisseId!: number;
  selectedCaisseData!: any;

  aprovisionForm: FormGroup;

  totalReel: number = 0;
  totalPaye: number = 0;
  resteImpaye: number = 0;

  // affichage div
  showPayement: boolean = true;

  // loading
  loadingAchat!: boolean;
  errorAchat!: string | null;

  constructor(private apiService: ApiServiceService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder){
    this.aprovisionForm = this.fb.group({
      pos: this.fb.control('', Validators.required),
      distr: this.fb.control('',Validators.required),
      list_product: this.fb.array([], Validators.required),
      newProduct: this.fb.group({
        id: new FormControl('', Validators.required),
        product_name: new FormControl('', Validators.required),
        quantity: new FormControl('', Validators.required),
        prixAchatDistributeur: new FormControl('', Validators.required),
        prixVenteDistributeur: new FormControl('', Validators.required),
        dateExpiration: new FormControl('',Validators.required),
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
        this.idPos = +params['id'];
        this.apiService.getPosById(this.idPos).subscribe({
          next: (dataPos:any) => {
            this.dataPos = dataPos;
            console.log('data du client', this.dataPos);
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
    this.getAllDistributeur();
    this.getAllPos();
    this.getCaisse();
    console.log('venteForm', this.aprovisionForm.value);
  }

  onSourceChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedSource = Number(input.value);
    console.log('selected source',this.selectedSource)
  }

  // pour distributeur
  getAllDistributeur(){
    this.apiService.getAllDistributeur().subscribe({
      next: (dataDistr: any) => {
        this.allDistributeur = dataDistr.results;
        console.log('distributeur', this.allDistributeur);
      },
      error: (err) => {
        console.error('erreur de recuperation de distributeur', err);
      }
    })
  }

  selectDistributeur(event: Event){
    this.selectedDistrId = Number((event.target as HTMLSelectElement).value);
    this.selectedDistrData = this.allDistributeur.find((item:any) => item.id === this.selectedDistrId);
    console.log('selected distributeur', this.selectedDistrData);
  }

  // pour pos
  getAllPos(){
    this.apiService.getAllPos().subscribe({
      next: (dataPos: any) => {
        this.allPos = dataPos.results.filter((pos: { id: number; }) => pos.id !== this.idPos);
        console.log('basket agent', this.dataPos);
      },
      error: (err) => {
        console.error('erreur de recuperation de basketAgent', err);
      }
    })
  }

  selectPos(event: Event){
    this.selectedPosId = Number((event.target as HTMLSelectElement).value);
    this.selectedPosData = this.allPos.find((item:any) => item.id === this.selectedPosId);
    console.log('selected POS', this.selectedPosData);
  }

  // fonction pour user
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

  // fonction de type echange
  selectedCaisse(event: Event){
    this.selectedCaisseId = Number((event.target as HTMLSelectElement).value);
    this.selectedCaisseData = this.caisseData.find((item:any) => item.id === this.selectedCaisseId);
    
    console.log('selected caisse', this.selectedCaisseData)
  }

  getCaisse(){
    this.apiService.getAllCaisse().subscribe({
      next: (dataCaisse:any) => {
        this.caisseData = dataCaisse.results;
        console.log('Caisses', this.caisseData);
      },
      error: (err) => {
        console.error('erreur de recuperation de caisses', err);
      }
    })
  }

  removeModePay(index:number){
    if(this.tabModePay.length > 1){
      this.tabModePay.splice(index,1);
    }
  }

  addTypeEchange() {
    this.listTypeEchange.push(this.fb.group({
      caisse_id: this.selectedCaisseId,
      typeEchange_id: this.selectedCaisseData.typeEchange,
      caisse: this.selectedCaisseData.pos_name,
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
    console.log('list des types dans form', this.aprovisionForm.value);
  }


  // fonction de product
  selectProduct(event: Event){
    this.selectedProductId = Number((event.target as HTMLSelectElement).value);
    if(this.selectedSource == 2){
      this.selectedProductData = this.selectedPosData.list_product.find((item:any) => item.product === this.selectedProductId);
    }else if(this.selectedSource == 1){
      this.selectedProductData = this.selectedDistrData.product_list.find((item:any) => item.id === this.selectedProductId);
    }
    
    console.log('selected product data', this.selectedProductData);
    
  }

  removeProduct(data:any){
    if(this.tabProducts.length > 1){
      this.tabProducts.splice(data, 1);
    }
    console.log('resultat aprs suppression de product dans vente', this.tabProducts);
  }

  addProductByForm() {
    let prixAchat = 0;
    let prixVente = 0;
    let date_expiration = '';
    let product_name = '';
    if(this.selectedSource == 2){
      prixAchat = this.selectedProductData.prixAchat;
      prixVente = this.selectedProductData.prixVente;
      product_name = this.selectedProductData.product_name;
      date_expiration = this.selectedProductData.date_expiration;
    }else{
      prixAchat = this.newProduct.value.prixAchatDistributeur;
      prixVente = this.newProduct.value.prixVenteDistributeur;
      product_name = this.selectedProductData.name;
      date_expiration = this.newProduct.value.dateExpiration;
    }
    this.listProduct.push(this.fb.group({
      id: this.selectedProductId,
      product_name: product_name,
      quantity: new FormControl(this.newProduct.value.quantity, Validators.required),
      prixAchat: prixAchat,
      prixVente: prixVente,
      date_expiration: date_expiration,
    }));
    let newTotal = 0;
    for(let product of this.listProduct.value){
      newTotal += (product.prixAchat * product.quantity);
    };
    this.totalReel = newTotal;

    // Réinitialiser le FormGroup pour le nouveau produit
    this.newProduct.reset();
    console.log('list des products dans form', this.listProduct.value);
  }

  // recuperations des info dans le form
  get listProduct(): FormArray {
    return this.aprovisionForm.get('list_product') as FormArray;
  }

  get listTypeEchange(): FormArray {
    return this.aprovisionForm.get('typeEchange') as FormArray;
  }

  get newProduct(): FormGroup {
    return this.aprovisionForm.get('newProduct') as FormGroup;
  }

  get newTypeEchange(): FormGroup {
    return this.aprovisionForm.get('newTypeEchange') as FormGroup;
  }

  get typeEchange(): FormArray {
    return this.aprovisionForm.get('typeEchange') as FormArray;
  }

  

  createAchat(){
    // si source est pos
    if(this.selectedSource == 2){
      this.loadingAchat = true;
      console.log('approvisionnement dans form',this.aprovisionForm.value);
      const data = {
        posDistributeur: this.selectedPosId,
        posCible: this.idPos,
        montant: this.totalPaye,
        reste: this.resteImpaye,
        date_recouvrement: this.aprovisionForm.value.dateRecouvrement || new Date().toISOString().split('T')[0],
      };
      this.apiService.createProvisionPos(data).subscribe({
        next: (data:any) => {
          console.log('approvisionnement enregistrer', data);
          const requests = [];
          // update product en backend
          for(let product of this.listProduct.value){
            const dataProduct = {
              approvisionnement: data.id,
              product: product.id,
              quantity: product.quantity,
              prixAchat: product.prixAchat,
              prixVente: product.prixVente,
              date_expiration: product.date_expiration,
            };
            const request = this.apiService.createListProductProvisionPos(dataProduct);
            requests.push(request);
          };

          for(let pay of this.listTypeEchange.value){
            const dataPay = {
              approvisionnement: data.id,
              typeEchange: pay.typeEchange_id,
              montant: pay.montant,
              bordereau: pay.bordereau  || 'pas de bordereau',
            };
            const request = this.apiService.createListPayApprovisionnementPos(dataPay);
            requests.push(request);
            // update de caisse
            const caisseCible = this.caisseData.find((item:any) => item.id == pay.caisse_id);
            const caisseSource = this.caisseData.find((item:any) => item.typeEchange == pay.typeEchange_id && item.pos == this.selectedPosData.id);
            const newMontantCaisseSource = caisseSource.montant + pay.montant;
            const newMontantCaisseCible = caisseCible.montant - pay.montant;
            const newDataCaisseSource = {
              montant: newMontantCaisseSource
            };
            const newDataCaisseCible = {
              montant: newMontantCaisseCible
            };
            const requestCaisseSource = this.apiService.updateCaisse(caisseSource.id,newDataCaisseSource);
            const requestCaisseCible = this.apiService.updateCaisse(caisseCible.id,newDataCaisseCible);
            requests.push(requestCaisseSource);
            requests.push(requestCaisseCible);
          };

          forkJoin(requests).subscribe({
            next: (resp:any) => {
              this.router.navigate(['/listPOS']);
              console.log('creation reussi', resp);
              this.loadingAchat = false;
            },
            error: (err) => {
              this.apiService.deleteProvisionPos(data.id);
              console.error('erreur de creation et suppression de achat', err);
              this.loadingAchat = false;
              this.errorAchat = 'Une erreur est survenue pendant l\'achat';
            }
          });
        },
        error: (err) => {
          this.loadingAchat = false;
          this.errorAchat = 'Une erreur est survenue pendant l\'achat';
          console.error('erreur de creation de provision pos', err);
        }
      });
      console.log('data a envoyer', data);
    }
    // si source distributeur
    else if(this.selectedSource == 1){
      this.loadingAchat = true;
      console.log('approvisionnement dans form',this.aprovisionForm.value);
      const data = {
        distributeur: this.selectedDistrId,
        posCible: this.idPos,
        montant: this.totalPaye,
        reste: this.resteImpaye,
        date_recouvrement: this.aprovisionForm.value.dateRecouvrement || new Date().toISOString().split('T')[0],
      }
      this.apiService.createAchatPos(data).subscribe({
        next: (data:any) => {
          console.log('achat enregistrer', data);
          const requests = [];
          for(let product of this.listProduct.value){
            const dataProduct = {
              achat: data.id,
              product: product.id,
              quantity: product.quantity,
              prixAchat: product.prixAchat,
              prixVente: product.prixVente,
              date_expiration: product.date_expiration,
            }
            const request = this.apiService.createListProductAchatPos(dataProduct);
            requests.push(request);
          };

          for(let pay of this.listTypeEchange.value){
            const dataPay = {
              achat: data.id,
              caisse: pay.caisse_id,
              montant: pay.montant,
              bordereau: pay.bordereau  || 'pas de bordereau',
            };
            const request = this.apiService.createListPayAchatPos(dataPay);
            requests.push(request);
            // update caisse
            const caisse = this.caisseData.find((item:any) => item.id == pay.caisse_id);
            const newMontantCaisse = caisse.montant - pay.montant;
            const newDataCaisse = {
              montant: newMontantCaisse,
            };
            const requestCaisse = this.apiService.updateCaisse(caisse.id,newDataCaisse);
            requests.push(requestCaisse);
          };

          forkJoin(requests).subscribe({
            next: (resp:any) => {
              this.router.navigate(['/listPOS']);
              console.log('creation reussi', resp);
              this.loadingAchat = false;
            },
            error: (err) => {
              this.apiService.deleteProvisionPos(data.id);
              this.loadingAchat = false;
              this.errorAchat = 'Une erreur est survenue pendant l\'achat';
              console.error('erreur de creation et suppression de vente', err);
            }
          });
        },
        error: (err) => {
          this.loadingAchat = false;
          this.errorAchat = 'Une erreur est survenue pendant l\'achat';
          console.error('erreur de creation de provision pos', err);
        }
      });
      console.log('data a envoyer', data);
    }
  }

  // fonction d'affichage
  payementShow(){
    this.showPayement = true
  }
}
