import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-poste',
  imports: [ReactiveFormsModule],
  templateUrl: './list-poste.component.html',
  styleUrl: './list-poste.component.scss'
})
export class ListPosteComponent implements OnInit{

  userDate!: any;
  posteData!: any;

  loadingPage!: boolean;
  error!: string | null;

  newPosteForm = new FormGroup({
    namePoste: new FormControl('', Validators.required),
    salaire: new FormControl('', Validators.required),
  });

  editPosteForm = new FormGroup({
    nameOldPoste: new FormControl('', Validators.required),
    salaireOldPoste: new FormControl('', Validators.required),
  });

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

  createPoste(){
    const data = {
      name: this.newPosteForm.value.namePoste,
      salar: this.newPosteForm.value.salaire
    };
    this.apiService.createPoste(data).subscribe({
      next: (data:any) => {
        console.log('creation reussi de poste', data);
      },
      error: (err) => {
        console.error('erreur de creation de poste',err)
      }
    });
    location.reload();
  }

  editPost(id: number){
    const data = {
      name: this.editPosteForm.value.nameOldPoste,
      salar: Number(this.editPosteForm.value.salaireOldPoste),
    };
    console.log('data edit',data);
    this.apiService.editPost(id,data).subscribe({
      next: (data:any) => {
        console.log('edit reussis', data)
      },
      error: (err) => {
        console.error('erreur de edit', err)
      }
    });
    location.reload();
  }

}
