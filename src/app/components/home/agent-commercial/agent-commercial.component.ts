import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-commercial',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './agent-commercial.component.html',
  styleUrl: './agent-commercial.component.scss'
})
export class AgentCommercialComponent implements OnInit{

  userData!: any;
  data!: any;
  typeEchange: any;
  basketUser!: any;
  venteUser!: any;
  recouvrementUser!: any;

  allRender!: any;

  // loading et error
  loading!: boolean;
  error!: string | null ;

  loadingRendre!: boolean;
  errorRendre!: string | null ;

  loadingTransaction!: boolean;
  errorTransaction!: string | null ;

  // form
  transactionForm = new FormGroup({
    typeEchangeSource: new FormControl('', Validators.required),
    typeEchangeCible: new FormControl('', Validators.required),
    montantTransaction: new FormControl(0, Validators.required),
    bordereauTransaction: new FormControl('', Validators.required),
  });

  recouvrementForm = new FormGroup({
    typeEchangeCible: new FormControl('', Validators.required),
    montantTransaction: new FormControl(0, Validators.required),
    bordereauTransaction: new FormControl('', Validators.required),
  });
  
  constructor(private apiService: ApiServiceService, private router: Router){ }

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getTypeEchange();
    this.getBasketAgent();
    this.getVenteAgent();
    this.getAllRender();
    this.getAllRecouvrement();
  }

  getUserData(){
    this.apiService.currentUser.subscribe({
      next: (data:any) => {
        this.userData = data;
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

  // pour les transactions
  transaction(id:number){
    const vente = this.venteUser.find((item:any) => item.id == id);
    const idTypeEdit = this.transactionForm.value.typeEchangeSource;
    const typeEchangeVente = vente.typeEchange_list.find((item:any) => item.typeEchange == idTypeEdit);
    const newMontant = typeEchangeVente.montant - Number(this.transactionForm.value.montantTransaction);
    if(newMontant >= 0){
      this.loadingTransaction = true;
      const typeEditData = {
        montant: newMontant,
      };
      const newTypeData = {
        typeEchange: this.transactionForm.value.typeEchangeCible,
        vente: vente.id,
        montant : this.transactionForm.value.montantTransaction,
        bordereau: this.transactionForm.value.bordereauTransaction
      };
      this.apiService.updateTypeVente(typeEchangeVente.id,typeEditData).subscribe({
        next: (dataEditType: any) => {
          console.log('update reussi', dataEditType);
          this.apiService.createListPayVente(newTypeData).subscribe({
            next: (dataNewTypeVente: any) => {
              this.loadingTransaction = false;
              console.log('newTypeVente', dataNewTypeVente);
            },
            error: (err) => {
              this.loadingTransaction = false;
              this.errorTransaction = 'Erreur pendant l\'operation';
              console.error('erreur de creation de type vente', err);
            }
          })
        },
        error: (err) => {
          this.loadingTransaction = false;
          this.errorTransaction = 'Erreur pendant l\'operation';
          console.error('erreur de update', err);
        }
      });
    }
    
    console.log('transactionData sur submit', vente);
    
  }

  recouvrementNewTypeEchange(id:number){
    const recouvrement = this.recouvrementUser.find((item:any) => item.id == id);
    const newMontant = recouvrement.montant - Number(this.recouvrementForm.value.montantTransaction);
    if(newMontant >= 0){
      const typeEditData = {
        montant: newMontant,
      };
      const newTypeData = {
        respo: recouvrement.respo,
        typeEchange: this.recouvrementForm.value.typeEchangeCible,
        vente: recouvrement.vente,
        montant : this.recouvrementForm.value.montantTransaction,
        bordereau: this.recouvrementForm.value.bordereauTransaction
      };
      this.apiService.updateRecouvrement(id,typeEditData).subscribe({
        next: (dataEditType: any) => {
          console.log('update reussi', dataEditType);
          this.apiService.createRecouvrement(newTypeData).subscribe({
            next: (dataNewTypeVente: any) => {
              console.log('new type recouvrement', dataNewTypeVente);
            },
            error: (err) => {
              console.error('erreur de creation de type recouvrement', err);
            }
          })
        },
        error: (err) => {
          console.error('erreur de update', err);
        }
      });
    }
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
    this.loading = true;
    this.apiService.getAllVente().subscribe({
      next: (dataVente: any) => {
        this.loading = false;
        const data = dataVente.results;
        this.venteUser = data.filter((item:any) => item.agent_id === this.userData.id);
        console.log('Vente du user', this.venteUser);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erreur de connexion';
        console.error('erreur de recuperation de vente', err);
      }
    })
  }

  getAllRecouvrement(){
    this.apiService.getAllRecouvrement().subscribe({
      next: (resp: any) => {
        const data = resp.results;
        this.recouvrementUser = data.filter((item:any) => item.respo === this.userData.id);
        console.log('Recouvrement du user', this.recouvrementUser);
      },
      error: (err) => {
        console.error('erreur de recuperation du recouvrement', err);
      }
    })
  }

  getTotalTypeEchange(data:any): number {
    return data.reduce((sum: number, article: { montant: number }) => sum + article.montant, 0);
  }

  // verification de rendre
  getAllRender(){
    this.apiService.getAllRender().subscribe({
      next: (data:any) => {
        this.allRender = data.results;
        console.log('all render',this.allRender)
      },
      error: (err) => {
        console.error('erreur de recuperation', err)
      }
    })
  }

  renderSend(id: number){
    const render = this.allRender.filter((item:any) => item.vente == id);
    const lastRender = render[render.length - 1];
    if(!lastRender || (!lastRender.is_receiver && lastRender.receiver)){
      return false
    }else{
      return true
    }
  }

  isReceived(id: number){
    const render = this.allRender.filter((item:any) => item.vente == id);
    const lastRender = render[render.length - 1];
    if(lastRender && lastRender.is_received){
      return true
    }else{
      return false
    }
  }

  isRecouvrementReceived(id: number){
    const render = this.allRender.filter((item:any) => item.recouvrement == id);
    const lastRender = render[render.length - 1];
    console.log('last recouvrement',lastRender);
    if(lastRender && lastRender.is_received){
      return true
    }else{
      return false
    }
  }

  renderRecouvrementSend(id: number){
    const render = this.allRender.filter((item:any) => item.recouvrement == id);
    const lastRender = render[render.length - 1];
    if(!lastRender || (!lastRender.is_receiver && lastRender.receiver)){
      return false
    }else{
      return true
    }
  }


  rendre(id: number){
    this.loadingRendre = true;
    const vente = this.venteUser.find((item:any) => item.id === id);
    const dataRendu = {
      agent: this.userData.id,
      pos: vente.pos_id,
      vente: id,
    };
    this.apiService.createRenderAgentPos(dataRendu).subscribe({
          next: (dataRendu:any) => {
            console.log('new dataRendu create', dataRendu);
            const requests = [];
            for(let type of vente.typeEchange_list){
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
                        this.loadingRendre = false;
                        this.getAllRender();
                        // this.router.navigate(['/home']);
                        console.log('creation reussi', resp);
                      },
                      error: (err) => {
                        this.loadingRendre = false;
                        this.errorRendre = 'Erreur pendant l\'operation';
                        this.apiService.deleteRenderAgentPos(dataRendu.id);
                        console.error('erreur de creation et suppression de vente', err);
                      }
                    });
          },
          error: (err) => {
            this.loadingRendre = false;
            this.errorRendre = 'Erreur pendant l\'operation';
            console.error('erreur create dataRendu', err);
          }
        });
  }

  rendreRecouvrement(id: number){
    this.loadingRendre = true;
    const recouvrement = this.recouvrementUser.find((item:any) => item.id == id);
    const dataRendu = {
      agent: this.userData.id,
      pos: recouvrement.depot_id,
      recouvrement: id,
    };
    this.apiService.createRenderAgentPos(dataRendu).subscribe({
      next: (resp:any) => {
        console.log('new dataRendu create', resp);
        const dataType = {
          typeEchange: recouvrement.typeEchange,
          render: resp.id,
          montant: recouvrement.montant,
          bordereau: recouvrement.bordereau,
        };
        this.apiService.createTypeEchangeRenduPos(dataType).subscribe({
          next: (resp:any) => {
            this.loadingRendre = false;
            this.getAllRender();
            console.log('creation reussi', resp);
          },
          error: (err) => {
            this.loadingRendre = false;
            this.errorRendre = 'Erreur pendant l\'operation';
            this.apiService.deleteRenderAgentPos(resp.id);
            console.error('erreur de creation et suppression de vente', err);
          }
        });
      }
    });
  }
}

