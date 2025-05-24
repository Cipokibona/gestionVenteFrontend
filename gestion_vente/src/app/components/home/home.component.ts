import { Component, OnInit } from '@angular/core';
import { AgentCommercialComponent } from "./agent-commercial/agent-commercial.component";
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-home',
  imports: [AgentCommercialComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  userData!: any| null;
  allWallet!: any| null;
  typeEchange!: any| null;

  constructor(private apiService: ApiServiceService){}

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
    this.getAllWallet();
    this.getTypeEchange();
  }

  getUser(){
    this.apiService.currentUser.subscribe({
      next: (data) => {
        this.userData = data;
        console.log('userData dans home page:', this.userData);
      }
    });
  }

  getAllWallet(){
    this.apiService.getWallet().subscribe({
      next: (data: any) => {
        this.allWallet = data.results;
      }
    })
  }

  getTypeEchange(){
    this.apiService.getTypeEchange().subscribe({
      next: (data: any) => {
        this.typeEchange = data.results;
        console.log('type Echange', this.typeEchange);
      }
    })
  }
}
