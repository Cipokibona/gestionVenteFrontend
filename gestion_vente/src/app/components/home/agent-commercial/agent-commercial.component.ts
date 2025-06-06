import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-commercial',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './agent-commercial.component.html',
  styleUrl: './agent-commercial.component.scss'
})
export class AgentCommercialComponent implements OnInit{

  userData!: any;
  walletSumTotal!: number;
  data!: any;
  typeEchange: any;
  basketUser!: any;
  venteUser!: any;

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
    this.getBasketAgent();
    this.getVenteAgent();
  }

  getUserData(){
    this.apiService.currentUser.subscribe({
      next: (data:any) => {
        this.userData = data;
        this.walletSumTotal = 0;
        // for(let wallet of this.userData.wallet_user){
        //   this.walletSumTotal = this.walletSumTotal + wallet.montant;
        // }
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

  transaction(id:number){
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
    this.router.navigate(['/home']).then(() => {
        location.reload();
    });
    console.log('transactionData sur submit', walletCibleData);
    
  }

  getBasketAgent(){
    this.apiService.getBasketAgent().subscribe({
      next: (dataBasketAgent: any) => {
        const data = dataBasketAgent.results;
        this.basketUser = data.filter((item:any) => item.agent === this.userData.id);
        console.log('panier pour le user dans home page', this.basketUser);
      },
      error: (err) => {
        console.error('erreur de recuperation de panier dans home page', err);
      }
    })
  }

  getVenteAgent(){
    this.apiService.getAllVente().subscribe({
      next: (dataVente: any) => {
        const data = dataVente.results;
        this.venteUser = data.filter((item:any) => item.agent_id === this.userData.id);
        console.log('Vente du user', this.venteUser);
      },
      error: (err) => {
        console.error('erreur de recuperation de vente', err);
      }
    })
  }

  getTotalTypeEchange(data:any): number {
    return data.reduce((sum: number, article: { montant: number }) => sum + article.montant, 0);
  }

  rendre(id: number){
    const pos = this.venteUser.find((item:any) => item.pos_id === id);
    const dataRendu = {
      agent: this.userData.id,
      pos: pos.pos_id,
    };
    this.apiService.createRenderAgentPos(dataRendu).subscribe({
          next: (dataRendu:any) => {
            console.log('new dataRendu create', dataRendu);
            const requests = [];
            for(let type of pos.typeEchange_list){
              const dataType = {
                typeEchange: type.typeEchange,
                render: dataRendu.id,
                montant: type.montant,
                bordereau: type.bordereau,
              }
              const request = this.apiService.createTypeEchangeRenduPos(dataType);
              requests.push(request);
            };
    
            forkJoin(requests).subscribe({
                      next: (resp:any) => {
                        // this.router.navigate(['/home']);
                        console.log('creation reussi', resp);
                      },
                      error: (err) => {
                        this.apiService.deleteRenderAgentPos(dataRendu.id);
                        console.error('erreur de creation et suppression de vente', err);
                      }
                    });
          },
          error: (err) => {
            console.error('erreur create dataRendu', err);
          }
        });
  }
}

