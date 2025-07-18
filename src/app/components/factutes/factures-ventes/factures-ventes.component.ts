import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-factures-ventes',
  imports: [CommonModule],
  templateUrl: './factures-ventes.component.html',
  styleUrl: './factures-ventes.component.scss'
})
export class FacturesVentesComponent implements OnInit{
  userDate!: any;
  allVente!: any;
  venteData!: any;
  totalVente: number = 0;

  loadingPage!: boolean;
  errorPage!: string | null;

  constructor(private apiService: ApiServiceService, private route: ActivatedRoute){}
  
  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
    this.getAllVente();
  }

  getUser(){
    this.loadingPage = true;
    this.apiService.currentUser.subscribe({
      next: (data: any) => {
        this.userDate = data;
        this.loadingPage = false;
        this.errorPage = null;
        console.log('userdata',this.userDate);
      },
      error: (err) => {
        this.loadingPage = false;
        this.errorPage = 'Erreur pendant le telechargement du user';
        console.error('erreur de userdata', err);
      }
    });
  }
  
  getAllVente(){
    this.loadingPage = true;
    this.apiService.getAllVente().subscribe({
      next: (data:any) => {
        this.allVente = data.results;
        this.loadingPage = false;
        this.errorPage = null;
        this.route.params.subscribe(
          params => {
            const venteId = +params['id'];
            this.venteData = this.allVente.find(
              (item:any) => item.id === venteId
            );
            
          }
        );
        this.totalVente = this.venteData.product_list.reduce(
          (sum:any, item:any) => sum + (item.quantity * item.pricePerUnitClient), 0
        );
        console.log('liste de vente et venteData', this.allVente, this.venteData);
      },
      error: (err) => {
        this.loadingPage = false;
        this.errorPage = 'Erreur de chargement!!!';
        console.error('erreur de recuperation de vente',err)
      }
    })
  }
}
