import { Component } from '@angular/core';
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
  walletSumTotal: number = 0;
  
  constructor(private apiService: ApiServiceService, private router: Router){
    this.apiService.currentUser.subscribe({
      next: (data) => {
        this.userData = data;
        for(let wallet of this.userData.wallet_user){
          this.walletSumTotal = this.walletSumTotal + wallet.montant;
        }
        console.log('les data dans agent-commercial component:', this.userData);
      },error: () => {
        this.apiService.logout();
        // this.router.navigate(['/login']);
      }
    });
  }
}
