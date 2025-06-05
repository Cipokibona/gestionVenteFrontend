import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-baskets',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './list-baskets.component.html',
  styleUrl: './list-baskets.component.scss'
})
export class ListBasketsComponent implements OnInit{
  paniers!: any;
  allVentes!: any;
  venteCreditClient!: any;

  userData!: any;

  loadingPage!: boolean;
  error!: string | null;

  clientForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    adress: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiServiceService) {
  }

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getBaskets();
    this.getAllVente();
    this.getCreditVenteClient();
  }

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

  getBaskets(){
    this.apiService.getBasketAgent().subscribe({
      next: (dataPanier: any) => {
        this.paniers = dataPanier.results;
        console.log('list des paniers', this.paniers);
      },
      error: (err) => {
        console.error('erreur de recuperation', err);
      }
    })
  }

  getAllVente(){
    this.apiService.getAllVente().subscribe({
      next: (data:any) => {
        this.allVentes = data.results;
        console.log('all vente',this.allVentes)
      },
      error: (err) => {
        console.error('erreur de recuperation', err)
      }
    })
  }

  getCreditVenteClient(){
    this.venteCreditClient = this.allVentes.filter((item:any) => item.reste > 0);
    console.log('vente avec credit', this.venteCreditClient);
  }

  createClient(){
    const newClient = {
      respo: this.userData.id,
      fullName: this.clientForm.value.fullName,
      adress: this.clientForm.value.adress,
      tel: this.clientForm.value.tel
    }
    console.log('data client a envoye', newClient);
    this.apiService.createCustomer(newClient).subscribe({
      next: (data:any) => {
        console.log('new client create', data);
      },
      error: (err) => {
        console.error('new client create', err);
      }
    })
  }

  rendre(id:number){
    const basket = this.paniers.find((item:any) => item.id > id);
    const dataRendu = {
      agent: basket.agent,
      pos: basket.depot,
    };
    this.apiService.createRenderAgentPos(dataRendu).subscribe({
      next: (dataRendu:any) => {
        console.log('new dataRendu create', dataRendu);
        const requests = [];
        for(let product of basket.list_product){
          const dataProduct = {
            product: product.product,
            render: dataRendu.id,
            quantity: product.quantity,
            pricePerUnitOfficiel: product.pricePerUnitOfficiel,
            date_expiration: product.date_expiration,
          }
          const request = this.apiService.createProduitRenduPos(dataProduct);
          requests.push(request);
        };

        forkJoin(requests).subscribe({
                  next: (resp:any) => {
                    // this.router.navigate(['/home']);
                    console.log('creation reussi', resp);
                  },
                  error: (err) => {
                    this.apiService.deleteVente(dataRendu.id);
                    console.error('erreur de creation et suppression de vente', err);
                  }
                });
      },
      error: (err) => {
        console.error('erreur create dataRendu', err);
      }
    })
  }
}
