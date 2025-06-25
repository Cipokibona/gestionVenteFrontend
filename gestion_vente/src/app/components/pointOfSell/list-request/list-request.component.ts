import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-request',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './list-request.component.html',
  styleUrl: './list-request.component.scss'
})
export class ListRequestComponent implements OnInit{
  userData!: any;
  requestData: any;
  posData: any;

  loading!: boolean;
  error!: string | null;

  loadingAccept!: boolean;
  errorAccept!: string | null;

  
  constructor(private apiService: ApiServiceService, private router: Router){ 
    
   }

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getAllPos();
    this.getAllRequest();
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

  getAllPos(){
    this.apiService.getAllPos().subscribe({
      next: (data: any) => {
        this.posData = data.results;
        console.log('pos', this.posData);
      },
      error: (err) => {
        console.error('erreur de recuperation de request', err);
      }
    })
  }

  getAllRequest(){
    this.apiService.getAllRequest().subscribe({
      next: (data: any) => {
        const requestData = data.results;
        if(this.userData.is_admin){
          this.requestData = requestData;
          console.log('request admin',this.requestData);
        }else if(this.userData.is_respo_pos){
          console.log('pos data', this.posData);
          const posUser = this.posData.find((item: any) =>
            item.list_respo.some((i: any) => i.respo === this.userData.id)
          );
          this.requestData = requestData.filter(
            (item:any) => item.pos == posUser.id
          );
          console.log('request respo',this.requestData);
        }else{
          this.requestData = requestData.filter(
            (item:any) => item.agent == this.userData.id
          );
          console.log('request agent',this.requestData);
        }
      },
      error: (err) => {
        console.error('erreur de recuperation de request', err);
      }
    })
  }

  deliver(request_id:number){}

  noDeliver(request_id:number){
    this.loadingAccept = true;
    const dataRequest = {
      is_active: false,
    };
    this.apiService.editRequest(request_id, dataRequest).subscribe({
      next: (data:any) => {
        this.loadingAccept = false;
        console.log('modification reussi',data);
        this.getAllRequest();
      },
      error: (err) => {
        this.loadingAccept = false;
        this.errorAccept = 'Erreur!!!';
        console.error('Erreur de modification');
      }
    });
  }

}
