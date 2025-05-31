import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-poste',
  imports: [],
  templateUrl: './list-poste.component.html',
  styleUrl: './list-poste.component.scss'
})
export class ListPosteComponent implements OnInit{

  userDate!: any;
  posteData!: any;

  loadingPage!: boolean;
  error!: string | null;

  constructor(private apiService: ApiServiceService, private router: Router){}

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
    this.getPoste();
  }

  getUser(){
    this.loadingPage = true;
    this.apiService.currentUser.subscribe({
      next: (data: any) => {
        this.loadingPage = false;
        this.userDate = data;
        console.log('userdata',this.userDate);
      },
      error: (err) => {
        this.loadingPage = false;
        this.error = 'Erreur pendant le telechargement du user';
        console.error('erreur de userdata', err);
      }
    });
  }

  getPoste(){
    this.loadingPage = true;
    this.apiService.getAllPoste().subscribe({
      next: (data: any) => {
        this.loadingPage = false;
        this.posteData = data.results;
        console.log('all poste', this.posteData);
      },
      error: (err) => {
        this.loadingPage = false;
        this.error = 'Erreur pendant le telechargement de postes';
      }
    })
  }
}
