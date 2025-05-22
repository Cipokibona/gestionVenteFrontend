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

  constructor(private apiService: ApiServiceService){}

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
  }

  getUser(){
    this.apiService.currentUser.subscribe({
      next: (data) => {
        this.userData = data;
        console.log('userData dans home page:', this.userData);
      }
    });
  }
}
