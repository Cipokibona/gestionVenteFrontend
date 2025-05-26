import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-agent-commercial',
  imports: [ReactiveFormsModule],
  templateUrl: './agent-commercial.component.html',
  styleUrl: './agent-commercial.component.scss'
})
export class AgentCommercialComponent implements OnInit{

  userData!: any;
  walletSumTotal!: number;
  data!: any;
  typeEchange: any;

  // form
  transactionForm = new FormGroup({
    typeEchangeSource: new FormControl('', Validators.required),
    typeEchangeCible: new FormControl('', Validators.required),
    montantTransaction: new FormControl('', Validators.required),
    bordereauTransaction: new FormControl('', Validators.required),
  });
  
  constructor(private apiService: ApiServiceService, private router: Router){  }

  ngOnInit(): void {
    this.getUserData();
    this.getTypeEchange();
  }

  getUserData(){
    this.apiService.currentUser.subscribe({
      next: (data) => {
        this.userData = data;
        this.walletSumTotal = 0;
        for(let wallet of this.userData.wallet_user){
          this.walletSumTotal = this.walletSumTotal + wallet.montant;
        }
        console.log('les data dans agent-commercial component:', this.userData);
      },error: () => {
        this.apiService.logout();
        // this.router.navigate(['/login']);
      }
    });
  }

  getTypeEchange(){
    this.apiService.getTypeEchange().subscribe({
      next: (data: any) => {
        this.typeEchange = data.results;
      }
    })
  }

  transaction(){
    const typeEchange = this.transactionForm.value.typeEchangeCible;
    let montant: any = this.transactionForm.value.montantTransaction;
    const walletSource = this.transactionForm.value.typeEchangeSource;
    const walletCibleData = {
      user: this.userData.id,
      typeEchange: typeEchange || '',
      montant: montant || '',
      bordereau: this.transactionForm.value.bordereauTransaction || '',
    };
    const walletSourceData = {
      montant : montant
    };
    // verification de montant cible
    for(let wallet of this.userData.wallet_user){
      console.log('wallet.id et walletSource', wallet.id,walletSource);
      if(wallet.id == walletSource){
        if(montant && wallet.montant > montant){
          this.apiService.createWallet(walletCibleData).subscribe({
            next: (data) => {
              console.log('resultat de create wallet', data);
              this.apiService.updateWallet(walletSource, walletSourceData).subscribe({
                next: (data) => {
                  console.log('update de wallet source avec susses', data);
                },
                error: (err) => {
                  console.error('erreur de update', err);
                }
              })
            },
            error: (err) => {
              console.error('erreur de create wallet',err);
            }
          });
        }
      }
    };
    // if(walletSource == this.transactionForm.value.typeEchangeCible){
    //   console.log('la source et la cible est la meme');
    // }
    console.log('transactionData sur submit', walletCibleData);
    
  }
}

