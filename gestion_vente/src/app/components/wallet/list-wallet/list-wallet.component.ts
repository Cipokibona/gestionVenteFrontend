import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from 'express';

@Component({
  selector: 'app-list-wallet',
  imports: [ReactiveFormsModule],
  templateUrl: './list-wallet.component.html',
  styleUrl: './list-wallet.component.scss'
})
export class ListWalletComponent implements OnInit{
  userDate!: any;
  typeEchangeData!: any;

  loadingPage!: boolean;
  error!: string | null;

  newTypeForm = new FormGroup({
    nameType: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    is_bordereau: new FormControl('', Validators.required),
    is_devise: new FormControl('', Validators.required),
  });

  editTypeForm = new FormGroup({
    nameType: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    is_bordereau: new FormControl('', Validators.required),
    is_devise: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiServiceService, private router: Router){}

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
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

  getTypeEchange(){
    this.loadingPage = true;
    this.apiService.getTypeEchange().subscribe({
      next: (data: any) => {
        this.loadingPage = false;
        this.typeEchangeData = data.results;
        console.log('all type', this.typeEchangeData);
      },
      error: (err) => {
        this.loadingPage = false;
        this.error = 'Erreur pendant le telechargement de type';
      }
    })
  }

  createTypeEchange(){
    const data = {
      nom: this.newTypeForm.value.nameType,
      description: this.newTypeForm.value.description,
      is_bordereau: this.newTypeForm.value.is_bordereau,
      is_devise: this.newTypeForm.value.is_devise,
    };
    this.apiService.createTypeEchange(data).subscribe({
      next: (data:any) => {
        console.log('creation reussi de type', data);
        location.reload();
      },
      error: (err) => {
        console.error('erreur de creation de type',err)
      }
    });
  }

  editType(id: number){
    const data = {
      nom: this.editTypeForm.value.nameType,
      description: this.editTypeForm.value.description,
      is_bordereau: this.editTypeForm.value.is_bordereau,
      is_devise: this.editTypeForm.value.is_devise,
    };
    console.log('data edit',data);
    this.apiService.editTypeEchange(id,data).subscribe({
      next: (data:any) => {
        console.log('edit reussis', data)
      },
      error: (err) => {
        console.error('erreur de edit', err)
      }
    });
    // location.reload();
  }
}
