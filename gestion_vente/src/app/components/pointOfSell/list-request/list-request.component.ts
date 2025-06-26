import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-request',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './list-request.component.html',
  styleUrl: './list-request.component.scss'
})
export class ListRequestComponent implements OnInit{
  userData!: any;
  requestData: any;
  posData: any;

  allProductPos!: any;

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
    // this.getAllPos();
    this.getAllProductPos();
    this.getAllRequest();
  }

  getUserData(){
    this.loading = true;
    this.apiService.currentUser.subscribe({
      next: (data:any) => {
        this.userData = data;
        this.loading = false;
        console.log('les data dans receptions component:', this.userData);
      },error: () => {
        this.apiService.logout();
      }
    });
  }

  getAllPos(){
    // this.loading = true;
    this.apiService.getAllPos().subscribe({
      next: (data: any) => {
        this.posData = data.results;
        // this.loading = false;
        console.log('pos', this.posData);
      },
      error: (err) => {
        // this.loading = false;
        // this.error = 'Erreur de chargement!!!';
        console.error('erreur de recuperation de request', err);
      }
    });
  }

  getAllProductPos(){
    this.apiService.getAllProductPos().subscribe({
      next: (data:any) => {
        this.allProductPos = data.results;
        console.log('all product pos', this.allProductPos);
      },
      error: (err) => {
        console.error('erreur de recuperation de product pos',err);
      }
    })
  }

  getAllRequest(){
    this.loading = true;
    this.apiService.getAllRequest().subscribe({
      next: (data: any) => {
        const requestData = data.results;
        if(this.userData.is_admin){
          this.requestData = requestData;
          this.loading = false;
          console.log('request admin',this.requestData);
        }else if(this.userData.is_respo_pos){
          // this.getAllPos();
          // recuperation de posData
          this.apiService.getAllPos().subscribe({
            next: (data: any) => {
              this.posData = data.results;
              // find pos du user
              const posUser = this.posData.find((item: any) =>
                item.list_respo.some((i: any) => i.respo === this.userData.id)
              );
              // request du pos
              this.requestData = requestData.filter(
                (item:any) => item.pos == posUser.id
              );
              this.loading = false;
              console.log('pos', this.posData);
            },
            error: (err) => {
              this.loading = false;
              this.error = 'Erreur de chargement!!!';
              console.error('erreur de recuperation de request', err);
            }
          });
        }else{
          this.requestData = requestData.filter(
            (item:any) => item.agent == this.userData.id
          );
          this.loading = false;
          console.log('request agent',this.requestData);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erreur pendant le chargement!!!';
        console.error('erreur de recuperation de request', err);
      }
    })
  }

  deliver(request_id:number){
    this.loadingAccept = true;
    // recuperation de request par id
    const requestSelected = this.requestData.find(
      (item:any) => item.id == request_id
    );
    // data du new panier
    const newBasket = {
      agent: requestSelected.agent,
      depot: requestSelected.pos,
    };
    // data de desactivation de request
    const newDataRequest = {
      is_active: false
    };
    // creation du new basket
    this.apiService.createBasket(newBasket).subscribe({
      next: (dataBasket:any) => {
        const requests = [];
        for(let product of requestSelected.list_product){
          const dataProduct = {
            basket: dataBasket.id,
            product: product.product,
            quantity: product.quantity,
            pricePerUnitOfficiel: product.prixVente,
            date_expiration: product.date_expiration
          };
          const request = this.apiService.createListBasket(dataProduct);
          requests.push(request);
          // update product dans pos
          const productpos = this.allProductPos.filter(
            (item:any) => item.pos == requestSelected.pos
          );
          const thisProduct = productpos.find(
            (item:any) => item.product === product.product && item.prixVente === product.prixVente
          );
          console.log('product dans pos selected',thisProduct);
          const newQuantity = thisProduct.quantity - product.quantity;
          const newDataProduct = {
            quantity: newQuantity,
          };
          const requestUpdate = this.apiService.updateProductPos(thisProduct.id,newDataProduct);
          requests.push(requestUpdate);
        };

        // request de update de request
        const requestUpdateRequest = this.apiService.editRequest(request_id,newDataRequest);
        requests.push(requestUpdateRequest);

        forkJoin(requests).subscribe({
          next: (resp:any) => {
            this.getAllRequest();
            this.loadingAccept = false;
            console.log('creation reussi', resp);
          },
          error: (err) => {
            this.apiService.deleteBasket(dataBasket.id);
            this.loadingAccept = false;
            this.errorAccept = 'Erreur de creation de panier!!!';
            console.error('erreur de creation de list product et suppression du new basket',err);
          }
        });
      },
      error: (err) => {
        this.loadingAccept = false;
        this.errorAccept = 'Erreur !!!';
        console.error('erreur de creation', err);
      }
    });
  }

  noDeliver(request_id:number){
    this.loadingAccept = true;
    const dataRequest = {
      is_active: false,
    };
    this.apiService.editRequest(request_id, dataRequest).subscribe({
      next: (data:any) => {
        this.loadingAccept = false;
        console.log('modification reussi',data);
        this.getAllRequest();
      },
      error: (err) => {
        this.loadingAccept = false;
        this.errorAccept = 'Erreur!!!';
        console.error('Erreur de modification');
      }
    });
  }

}
