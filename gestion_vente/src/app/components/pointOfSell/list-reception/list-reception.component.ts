import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-reception',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './list-reception.component.html',
  styleUrl: './list-reception.component.scss'
})
export class ListReceptionComponent implements OnInit{
  userData!: any;
  typeEchange: any;
  recouvrementData!: any;
  allRender!: any;
  allProduitPos!: any;
  allCaisse!: any;

  loading!: boolean;
  error!: string | null;

  loadingAccept!: boolean;
  errorAccept!: string | null;

  
  constructor(private apiService: ApiServiceService, private router: Router){ 
    
   }

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getTypeEchange();
    this.getAllRender();
    this.getAllCaissePos();
    this.getAllProductPos();
  }

  getUserData(){
    this.apiService.currentUser.subscribe({
      next: (data:any) => {
        this.userData = data;
        console.log('les data dans receptions component:', this.userData);
      },error: () => {
        this.apiService.logout();
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

  // verification du bordereau pour le type echange
  needBordereau(id:any){
    const type = this.typeEchange.find((item:any) => item.id == id);
    if(type.is_bordereau){
      return true
    }else{
      return false
    }
  }

  // product pos
  getAllProductPos(){
    this.apiService.getAllProductPos().subscribe({
      next: (resp: any) => {
        const data = resp.results.filter((item:any) => item.receiver == null);
        this.allProduitPos = data;
        console.log('all product du pos', this.allProduitPos);
      },
      error: (err) => {
        console.error('erreur de recuperation product de pos', err);
      }
    })
  }

  // recuperation des caisses
  getAllCaissePos(){
    this.apiService.getAllCaisse().subscribe({
      next: (resp: any) => {
        const data = resp.results;
        this.allCaisse = data;
        console.log('all caisse du pos', this.allCaisse);
      },
      error: (err) => {
        console.error('erreur de recuperation caisse de pos', err);
      }
    })
  }

  getAllRender(){
    this.loading = true;
    this.apiService.getAllRender().subscribe({
      next: (resp: any) => {
        const data = resp.results.filter((item:any) => item.receiver == null);
        this.allRender = data;
        this.loading = false;
        console.log('all render du pos', this.allRender);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erreur du chargement!!!';
        console.error('erreur de recuperation du recouvrement', err);
      }
    })
  }

  received(id: number){
    this.loadingAccept = true;
    // data de update de rendu
    const dataRendu = {
      receiver: this.userData.id,
      is_received: true,
    };
    // table des requests
    const requests = [];
    // requete de received
    const requestReceived = this.apiService.updateRenderAgentPos(id, dataRendu);
    requests.push(requestReceived);
    // find de render par id parmis tous les render
    const render = this.allRender.find((item:any) => item.id == id);
    // trouver les produits a partir du pos
    const listProductForThisPos = this.allProduitPos.filter((item:any) => item.pos == render.pos);
    // si c'est les produits rendu au pos par l'agent
    if(render.product_list.length > 0){
      for (let product of render.product_list){
        const dataProductPos = listProductForThisPos.find(
          (item:any) => 
            item.product == product.product && item.prixVente == product.pricePerUnitOfficiel && item.date_expiration == product.date_expiration);
        const newDataProductPos = {
          quantity: dataProductPos.quantity + product.quantity,
        };
        const requestUpdateProduct = this.apiService.updateProductPos(dataProductPos.id,newDataProductPos);
        requests.push(requestUpdateProduct);
        // update de render
        const dataRender = {
          receiver: this.userData.id,
          is_received: true,
        };
        const requestRender = this.apiService.updateRenderAgentPos(id,dataRender);
        requests.push(requestRender);

        // desactiver le panier
        const panier = {
          is_active: false,
        }
        const requestPanier = this.apiService.updateBasket(render.panier,panier);
        requests.push(requestPanier);

        forkJoin(requests).subscribe({
          next: (resp:any) => {
            console.log('update de render et produit reussi', resp);
            this.getAllRender();
          },
          error: (err) => {
            this.loadingAccept = false;
            this.errorAccept = 'Erreur !!!';
            console.error('erreur de update',err);
          }
        });
      }
    }else if(render.type_list.length > 0){
      for (let type of render.type_list){
        // recuperation du caisse du pos et son type
        const dataCaisse = this.allCaisse.find(
          (item:any) =>
            item.typeEchange == type.typeEchange && item.pos == render.pos
        );
        // new data a enregistrer
        const newDataCaisse = {
          montant: dataCaisse.montant + type.montant,
        };
        // requete de update caisse
        const requestUpdateCaisse = this.apiService.updateCaisse(dataCaisse.id,newDataCaisse);
        requests.push(requestUpdateCaisse);
        // enregister les bordereau
        const haveBordereau = this.needBordereau(type.typeEchange);
        if(haveBordereau){
          const dataBordereau = {
            caisse: dataCaisse.id,
            name: type.bordereau,
            montant: type.montant
          };
          const requestBordereau = this.apiService.createBordereauCaisse(dataBordereau);
          requests.push(requestBordereau);
        }

        forkJoin(requests).subscribe({
          next: (resp:any) => {
            console.log('update de render et produit reussi', resp);
            this.getAllRender();
          },
          error: (err) => {
            this.loadingAccept = false;
            this.errorAccept = 'Erreur !!!';
            console.error('erreur de update',err);
          }
        });
      }
    }
  }

  noReceived(id: number){
    this.loadingAccept = true;
    const dataRendu = {
      receiver: this.userData.id,
      is_received: false,
    };
    this.apiService.updateRenderAgentPos(id, dataRendu).subscribe({
      next: (resp:any) => {
        console.log('update render', resp);
        this.getAllRender();
      },
      error: (err) => {
        this.loadingAccept = false;
        this.errorAccept = 'Erreur!!!';
        console.error('erreur de update',err);
      }
    });
  }
}
