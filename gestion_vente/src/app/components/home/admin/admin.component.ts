import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiServiceService } from '../../../services/api-service.service';
import { forkJoin } from 'rxjs';

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

  // loading et error
  loading!: boolean;
  error!: string | null ;

  loadingTransaction!: boolean;
  errorTransaction!: string | null ;

  loadingVente!: boolean;
  errorVente!: string | null ;

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

  // pour les ventes
  getVente(){
    this.loadingVente = true;
    this.apiService.getAllVente().subscribe({
      next: (data:any) => {
        this.loadingVente = false;
        this.errorVente = null;
        const dataPos = data.results;
        this.venteData = dataPos;
        this.gainMois();
        console.log('all vente:', this.venteData);
      },error: () => {
        this.loadingVente = false;
        this.errorVente = 'Refresh';
        // this.apiService.logout();
      }
    });
  }

  gainMois(){
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
    let gainVente = 0;
    for (let ventes of venteMois){
      for (let vente of ventes.product_list){
        gainVente = gainVente + (vente.pricePerUnitClient * vente.quantity);
      }
    }
    this.venteMois = gainVente;
    console.log('vente du mois', this.venteMois);
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
