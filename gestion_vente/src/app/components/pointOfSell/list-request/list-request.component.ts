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
    // this.getAllPos();
    this.getAllRequest();
  }

  getUserData(){
    this.loading = true;
    this.apiService.currentUser.subscribe({
      next: (data:any) => {
        this.userData = data;
        this.loading = false;
        console.log('les data dans receptions component:', this.userData);
      },error: () => {
        this.apiService.logout();
      }
    });
  }

  getAllPos(){
    // this.loading = true;
    this.apiService.getAllPos().subscribe({
      next: (data: any) => {
        this.posData = data.results;
        // this.loading = false;
        console.log('pos', this.posData);
      },
      error: (err) => {
        // this.loading = false;
        // this.error = 'Erreur de chargement!!!';
        console.error('erreur de recuperation de request', err);
      }
    });
  }

  getAllRequest(){
    this.loading = true;
    this.apiService.getAllRequest().subscribe({
      next: (data: any) => {
        const requestData = data.results;
        if(this.userData.is_admin){
          this.requestData = requestData;
          this.loading = false;
          console.log('request admin',this.requestData);
        }else if(this.userData.is_respo_pos){
          // this.getAllPos();
          // recuperation de posData
          this.apiService.getAllPos().subscribe({
            next: (data: any) => {
              this.posData = data.results;
              // find pos du user
              const posUser = this.posData.find((item: any) =>
                item.list_respo.some((i: any) => i.respo === this.userData.id)
              );
              // request du pos
              this.requestData = requestData.filter(
                (item:any) => item.pos == posUser.id
              );
              this.loading = false;
              console.log('pos', this.posData);
            },
            error: (err) => {
              this.loading = false;
              this.error = 'Erreur de chargement!!!';
              console.error('erreur de recuperation de request', err);
            }
          });
        }else{
          this.requestData = requestData.filter(
            (item:any) => item.agent == this.userData.id
          );
          this.loading = false;
          console.log('request agent',this.requestData);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erreur pendant le chargement!!!';
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
