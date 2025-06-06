import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';

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

  
  constructor(private apiService: ApiServiceService, private router: Router){ 
    
   }

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getTypeEchange();
    this.getAllRender();
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

  getAllRender(){
    this.apiService.getAllRender().subscribe({
      next: (resp: any) => {
        const data = resp.results;
        this.allRender = data;
        console.log('all render du pos', this.allRender);
      },
      error: (err) => {
        console.error('erreur de recuperation du recouvrement', err);
      }
    })
  }

  receveid(id: number){
    const recouvrement = this.recouvrementData.find((item:any) => item.id == id);
    const dataRendu = {
      agent: this.userData.id,
      pos: recouvrement.depot_id,
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
            console.log('creation reussi', resp);
          },
          error: (err) => {
            this.apiService.deleteRenderAgentPos(resp.id);
            console.error('erreur de creation et suppression de vente', err);
          }
        });
      }
    });
  }
}
