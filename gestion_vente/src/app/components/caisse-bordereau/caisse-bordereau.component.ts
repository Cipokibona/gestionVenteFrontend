import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-caisse-bordereau',
  imports: [CommonModule],
  templateUrl: './caisse-bordereau.component.html',
  styleUrl: './caisse-bordereau.component.scss'
})
export class CaisseBordereauComponent implements OnInit{

  userData!: any;
  caisseId!: any;
  caisseData!: any;

  constructor(private apiService: ApiServiceService, private route: ActivatedRoute, private router: Router){ }

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getRoute();
  }

  getRoute(){
    this.route.params.subscribe(
      params => {
        this.caisseId = +params['id'];
        this.apiService.getCaisseById(this.caisseId).subscribe({
          next: (dataCaisse:any) => {
            this.caisseData = dataCaisse;
            console.log('data du caisse', this.caisseData);
          },
          error: (err) => {
            console.error('erreur de recuperation du data', err);
          }
        })
      }
    );
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
}
