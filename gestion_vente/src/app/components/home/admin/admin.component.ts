import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiServiceService } from '../../../services/api-service.service';
import { forkJoin, max } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit{
  userData!: any;
  data!: any;
  typeEchange: any;
  posData!: any;
  venteData!: any;
  venteMois!: any;
  depenseData!: any;
  depenseMois!: any;
  achatData!: any;
  achatMois!: any;
  bestVenteData!: any;
  bestVenteSum!: any;

  // loading et error
  loading!: boolean;
  error!: string | null ;

  loadingTransaction!: boolean;
  errorTransaction!: string | null ;

  loadingVente!: boolean;
  errorVente!: string | null ;

  loadingDepense!: boolean;
  errorDepense!: string | null ;

  loadingAchat!: boolean;
  errorAchat!: string | null ;

  // form
    transactionForm = new FormGroup({
      typeEchangeSource: new FormControl('', Validators.required),
      typeEchangeCible: new FormControl('', Validators.required),
      montantTransaction: new FormControl(0, Validators.required),
      bordereauTransaction: new FormControl('', Validators.required),
    });

  constructor(private apiService: ApiServiceService, private router: Router){ }

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getPos();
    this.getVente();
    this.getDepenses();
    this.getAchat();
  }

  getUserData(){
    this.apiService.currentUser.subscribe({
      next: (data:any) => {
        this.userData = data;
        console.log('les data dans respo component:', this.userData);
      },error: () => {
        this.apiService.logout();
      }
    });
  }

  getPos(){
    this.loading = true;
    this.apiService.getAllPos().subscribe({
      next: (data:any) => {
        this.loading = false;
        this.error = null;
        const dataPos = data.results;
        this.posData = dataPos;
        console.log('pos du respo:', this.posData);
      },error: () => {
        this.loading = false;
        this.error = 'Retry';
        // this.apiService.logout();
      }
    });
  }

  // pour les ventes, achat et depenses
  getVente(){
    this.loadingVente = true;
    this.apiService.getAllVente().subscribe({
      next: (data:any) => {
        this.loadingVente = false;
        this.errorVente = null;
        const dataPos = data.results;
        this.venteData = dataPos;
        this.venteMoth();
        this.bestSell();
        console.log('all vente:', this.venteData);
      },error: () => {
        this.loadingVente = false;
        this.errorVente = 'Refresh';
        // this.apiService.logout();
      }
    });
  }

  getDepenses(){
    this.loadingDepense = true;
    this.apiService.getAllDepenses().subscribe({
      next: (data:any) => {
        this.loadingDepense = false;
        this.errorDepense = null;
        const dataPos = data.results;
        this.depenseData = dataPos;
        this.depenseMoth();
        console.log('all depenses:', this.depenseData);
      },error: () => {
        this.loadingDepense = false;
        this.errorDepense = 'Refresh';
        // this.apiService.logout();
      }
    });
  }

  getAchat(){
    this.loadingAchat = true;
    this.apiService.getAllAchat().subscribe({
      next: (data:any) => {
        this.loadingAchat = false;
        this.errorAchat = null;
        const dataPos = data.results;
        this.achatData = dataPos;
        this.achatMoth();
        console.log('all achat:', this.achatData);
      },error: () => {
        this.loadingAchat = false;
        this.errorAchat = 'Refresh';
        // this.apiService.logout();
      }
    });
  }

  venteMoth(){
    const venteMois = this.venteData.filter(
      (item:any) => {
        const date = new Date(item.date); // Convertir la chaîne de date en objet Date
          const currentDate = new Date(); // Obtenir la date actuelle

          // Comparer l'année et le mois
          return (
              date.getFullYear() === currentDate.getFullYear() &&
              date.getMonth() === currentDate.getMonth()
          );
      }
    );
    console.log('vente data mois', venteMois);
    let sumVente = 0;
    for (let ventes of venteMois){
      for (let vente of ventes.product_list){
        sumVente = sumVente + (vente.pricePerUnitClient * vente.quantity);
      }
    }
    this.venteMois = sumVente;
    console.log('vente du mois', this.venteMois);
  }

  bestSell(){
    let thisVenteData = 0;
    let bestVenteData = 0;
    let bestVenteId: number | null;
    for(let vente of this.venteData){
      for(let i of vente.product_list){
        thisVenteData = thisVenteData + (i.pricePerUnitClient * i.quantity);
      };
      if(thisVenteData > bestVenteData){
        bestVenteData = thisVenteData;
        bestVenteId = vente.id;
      };
    };
    this.bestVenteData = this.venteData.find(
      (item:any) => item.id == bestVenteId
    );
    this.bestVenteSum = bestVenteData;
    console.log('best vente', this.bestVenteData, this.bestVenteSum);
  }

  achatMoth(){
    const achatMois = this.achatData.filter(
      (item:any) => {
        const date = new Date(item.date); // Convertir la chaîne de date en objet Date
          const currentDate = new Date(); // Obtenir la date actuelle

          // Comparer l'année et le mois
          return (
              date.getFullYear() === currentDate.getFullYear() &&
              date.getMonth() === currentDate.getMonth()
          );
      }
    );
    console.log('depenses data mois', achatMois);
    let sumAchat = 0;
    for (let achats of achatMois){
      for (let achat of achats.list_product){
        sumAchat = sumAchat + (achat.prixAchat * achat.quantity);
      }
    }
    this.achatMois = sumAchat;
    console.log('achat du mois', this.achatMois);
  }

  depenseMoth(){
    const depenseMois = this.depenseData.filter(
      (item:any) => {
        const date = new Date(item.date); // Convertir la chaîne de date en objet Date
          const currentDate = new Date(); // Obtenir la date actuelle

          // Comparer l'année et le mois
          return (
              date.getFullYear() === currentDate.getFullYear() &&
              date.getMonth() === currentDate.getMonth()
          );
      }
    );
    console.log('depenses data mois', depenseMois);
    let sumDepense = 0;
    for (let depenses of depenseMois){
      sumDepense = sumDepense + depenses.montant;
    }
    this.depenseMois = sumDepense;
    console.log('depense du mois', this.depenseMois);
  }

  // pour les transactions
  transaction(id:number){
    const pos = this.posData.find((item:any) => item.id == id);
    const dataSource = pos.list_caisse.find((item:any) => item.id == this.transactionForm.value.typeEchangeSource);
    const dataCible = pos.list_caisse.find((item:any) => item.id == this.transactionForm.value.typeEchangeCible);
    const newMontantSource = Number(dataSource.montant) - Number(this.transactionForm.value.montantTransaction);
    const newMontantCible = Number(dataCible.montant) + Number(this.transactionForm.value.montantTransaction);
    const newBordereau = {
      caisse: dataCible.id,
      name: this.transactionForm.value.bordereauTransaction,
      montant: this.transactionForm.value.montantTransaction,
    }
    if(newMontantSource >= 0){
      this.loadingTransaction = true;
      const sourceData = {
        montant: newMontantSource,
      };
      const cibleData = {
        montant: newMontantCible,
      };
      const requests = [];
      requests.push(this.apiService.updateCaisse(dataSource.id,sourceData));
      requests.push(this.apiService.updateCaisse(dataCible.id,cibleData));
      requests.push(this.apiService.createBordereauCaisse(newBordereau));
      forkJoin(requests).subscribe({
        next: (resp:any) => {
          this.loadingTransaction = false;
          this.errorTransaction = null;
          console.log('creation reussi', resp);
          location.reload();
        },
        error: (err) => {
          this.loadingTransaction = false;
          this.errorTransaction = 'Erreur retry';
          console.error('erreur', err);
        }
      })
    }
  }
}
