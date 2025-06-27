import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-pos',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './list-pos.component.html',
  styleUrl: './list-pos.component.scss'
})
export class ListPOSComponent {
  userData!: any;
  posData!: any;
  allUser!: any;
  requestData!: any;

  loading!: boolean;
  error!: '';

  loadingCommand!: boolean;
  errorCommand!: string | null;

  posForm = new FormGroup({
    namePos: new FormControl('', Validators.required),
    adress: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
  });

  respoForm = new FormGroup({
    respo: new FormControl('', Validators.required),
  });

  requestForm = new FormGroup({
    quantity: new FormControl(1, Validators.required),
  });

  constructor(private apiService: ApiServiceService){
      this.apiService.refreshTokenLocal();
      this.apiService.updateUserLocal();
      this.getUser();
      this.getAllpointVente();
      this.getAllUser();
      this.getAllRequest();
    }

  getUser(){
    this.apiService.currentUser.subscribe({
      next: (data) => {
        this.userData = data;
        console.log('userData dans list_product page:', this.userData);
      }
    });
  }

  getAllUser(){
    // this.loadingPage = true;
    this.apiService.getAllUser().subscribe({
      next: (data: any) => {
        // this.loadingPage = false;
        this.allUser = data.results;
        console.log('allusers',this.allUser);
      },
      error: (err) => {
        // this.loadingPage = false;
        // this.error = 'Erreur pendant le telechargement des users';
        console.error('erreur de allusers', err);
      }
    });
  }

  getAllpointVente(){
    this.apiService.getAllPos().subscribe({
      next: (dataPos: any) => {
        this.posData = dataPos.results;
        console.log('pos', this.posData);
      },
      error: (err) => {
        console.error('erreur de recuperation de distributeur', err);
      }
    })
  }

  getAllRequest(){
    this.apiService.getAllRequest().subscribe({
      next: (data: any) => {
        this.requestData = data.results;
        console.log('request', this.requestData);
      },
      error: (err) => {
        console.error('erreur de recuperation de request', err);
      }
    })
  }

  createRespo(id:number){
    const data = {
      pos: Number(id),
      respo: Number(this.respoForm.value.respo),
    };
    this.apiService.createResponsablePos(data).subscribe({
      next: (data:any) => {
        console.log('creation reussi de respo', data);
      },
      error: (err) => {
        console.error('erreur de creation de respo',err)
      }
    });
    location.reload();
  }

  createPos(){
    const data = {
      fullName: this.posForm.value.namePos,
      adress: this.posForm.value.adress,
      tel: this.posForm.value.tel
    };
    this.apiService.createPos(data).subscribe({
      next: (data:any) => {
        console.log('creation reussi de pos', data);
      },
      error: (err) => {
        console.error('erreur de creation de pos',err)
      }
    });
    location.reload();
  }

  createRequest(pos_id:number, product_id:number){
    this.loadingCommand = true;
    // verification exist request
    const requestPos = this.requestData.filter(
      (item:any) =>
        item.agent == this.userData.id && item.pos == pos_id
    );
    const requestExist = requestPos[requestPos.length - 1];
    // data du pos
    const thisPosData = this.posData.find(
      (item:any) => item.id == pos_id
    );
    // data du product
    const thisProductData = thisPosData.list_product.find(
      (item:any) => item.id == product_id
    );
    // condition si le request exist
    if(requestExist){
      const newProduct = {
        request: requestExist.id,
        product: product_id,
        quantity: this.requestForm.value.quantity,
        prixVente: thisProductData.prixVente,
        date_expiration: thisProductData.date_expiration
      };
      this.apiService.createRequestProduct(newProduct).subscribe({
        next: (data:any) => {
          location.reload();
          this.loadingCommand = false;
          console.log('new product request', data);
        },
        error: (err) => {
          this.loadingCommand = false;
          this.errorCommand = 'Erreur pendant la commande!!!';
          console.error('erreur de creation de product request', err);
        }
      });
    }else {
      const newRequest = {
        agent: this.userData.id,
        pos: pos_id
      };
      this.apiService.createRequest(newRequest).subscribe({
        next: (data:any) => {
          console.log('new request', data);
          const newProductRequest = {
            request: data.id,
            product: product_id,
            quantity: this.requestForm.value.quantity,
            prixVente: thisProductData.prixVente,
            date_expiration: thisProductData.date_expiration
          };
          this.apiService.createRequestProduct(newProductRequest).subscribe({
            next: (data:any) => {
              this.loadingCommand = false;
              location.reload();
              console.log('creation de new product request', data);
            },
            error: (err) => {
              this.loadingCommand = false;
              this.errorCommand = 'Erreur pendant la commande!!!';
              console.error('Erreur de creation de new product',err);
            }
          });
        },
        error: (err) => {
          this.loadingCommand = false;
          this.errorCommand = 'Erreur pendant la commande!!!';
          console.error('erreur de request', err);
        }
      });
    }
  }

  pourcentage(qte: number, max: number){
    const newMax = (100 * qte)/max;
    return newMax
  }
}
