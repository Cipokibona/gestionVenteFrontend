import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-respo-pos',
  imports: [CommonModule],
  templateUrl: './respo-pos.component.html',
  styleUrl: './respo-pos.component.scss'
})
export class RespoPosComponent implements OnInit{
  userData!: any;
  data!: any;
  typeEchange: any;
  posData!: any;

  constructor(private apiService: ApiServiceService, private router: Router){ }

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getPos();
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

  getPos(){
    this.apiService.getAllPos().subscribe({
      next: (data:any) => {
        const dataPos = data.results;
        this.posData = dataPos.filter((item:any) => item.list_respo.filter((i:any) => i.respo == this.userData.id));
        console.log('pos du respo:', this.posData);
      },error: () => {
        this.apiService.logout();
      }
    });
  }
}
