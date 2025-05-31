import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-agent-commercial',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './agent-commercial.component.html',
  styleUrl: './agent-commercial.component.scss'
})
export class AgentCommercialComponent implements OnInit{

  userData!: any;
  walletSumTotal!: number;
  data!: any;
  typeEchange: any;
  basketUser!: any;

  // form
  transactionForm = new FormGroup({
    typeEchangeSource: new FormControl('', Validators.required),
    typeEchangeCible: new FormControl('', Validators.required),
    montantTransaction: new FormControl('', Validators.required),
    bordereauTransaction: new FormControl('', Validators.required),
  });
  
  constructor(private apiService: ApiServiceService, private router: Router){ 
    
    
   }

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getTypeEchange();
    this.getProductAgent();
  }

  getUserData(){
    this.apiService.currentUser.subscribe({
      next: (data:any) => {
        this.userData = data;
        this.walletSumTotal = 0;
        for(let wallet of this.userData.wallet_user?){
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
            next: (dataCreate) => {
              console.log('resultat de create wallet', dataCreate);
              this.apiService.updateWallet(walletSource, walletSourceData).subscribe({
                next: (dataUpdate) => {
                  console.log('update de wallet source avec susses', dataUpdate);
                  const newTransaction = {
                    author: this.userData.id,
                    walletSource: walletSource,
                    walletCible: dataUpdate.id,
                    montant: montant,
                    bordereau: dataCreate.bordereau,
                    is_delivered: true,

                  };
                  this.apiService.createTransaction(newTransaction).subscribe({
                    next: (dataTransaction) => {
                      console.log('data Transaction', dataTransaction);
                    },
                    error: (err) => {
                      console.error('errer de transaction', err);
                    }
                  })
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
    this.router.navigate(['/home']).then(() => {
        location.reload();
    });
    console.log('transactionData sur submit', walletCibleData);
    
  }

  getProductAgent(){
    this.apiService.getProductBasket().subscribe({
      next: (dataBasketAgent: any) => {
        const data = dataBasketAgent.results;
        this.basketUser = data.filter((item:any) => item.agent === this.userData.id);
        console.log('panier pour les users dans home page', this.basketUser);
      },
      error: (err) => {
        console.error('erreur de recuperation de panier dans home page', err);
      }
    })
  }
}

