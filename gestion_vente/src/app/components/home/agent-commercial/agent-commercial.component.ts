import { Component, Input } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agent-commercial',
  imports: [],
  templateUrl: './agent-commercial.component.html',
  styleUrl: './agent-commercial.component.scss'
})
export class AgentCommercialComponent {

  userData!: any;
  walletSumTotal!: number;
  data!: any;
  typeEchange: any;
  
  constructor(private apiService: ApiServiceService, private router: Router){
    this.apiService.currentUser.subscribe({
      next: (data) => {
        this.userData = data;
        this.walletSumTotal = 0;
        for(let wallet of this.userData.wallet_user){
          this.walletSumTotal = this.walletSumTotal + wallet.montant;
        }
        console.log('les data dans agent-commercial component:', this.userData);
      },error: () => {
        this.apiService.logout();
        // this.router.navigate(['/login']);
      }
    });
    this.apiService.getTypeEchange().subscribe({
      next: (data: any) => {
        this.typeEchange = data.results;
      }
    })
  }
}

