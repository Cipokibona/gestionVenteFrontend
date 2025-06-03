import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-pos',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './list-pos.component.html',
  styleUrl: './list-pos.component.scss'
})
export class ListPOSComponent {
  userData!: any;
  posData!: any;
  allUser!: any;

  loading!: boolean;
  error!: '';

  posForm = new FormGroup({
    namePos: new FormControl('', Validators.required),
    adress: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
  });

  respoForm = new FormGroup({
    respo: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiServiceService){
      this.apiService.refreshTokenLocal();
      this.apiService.updateUserLocal();
      this.getUser();
      this.getAllpointVente();
      this.getAllUser();
    }

  getUser(){
    this.apiService.currentUser.subscribe({
      next: (data) => {
        this.userData = data;
        console.log('userData dans list_product page:', this.userData);
      }
    });
  }

  getAllUser(){
    // this.loadingPage = true;
    this.apiService.getAllUser().subscribe({
      next: (data: any) => {
        // this.loadingPage = false;
        this.allUser = data.results;
        console.log('allusers',this.allUser);
      },
      error: (err) => {
        // this.loadingPage = false;
        // this.error = 'Erreur pendant le telechargement des users';
        console.error('erreur de allusers', err);
      }
    });
  }

  getAllpointVente(){
    this.apiService.getAllPos().subscribe({
      next: (dataPos: any) => {
        this.posData = dataPos.results;
        console.log('pos', this.posData);
      },
      error: (err) => {
        console.error('erreur de recuperation de distributeur', err);
      }
    })
  }

  createRespo(id:number){
    const data = {
      pos: Number(id),
      respo: Number(this.respoForm.value.respo),
    };
    this.apiService.createResponsablePos(data).subscribe({
      next: (data:any) => {
        console.log('creation reussi de respo', data);
      },
      error: (err) => {
        console.error('erreur de creation de respo',err)
      }
    });
    location.reload();
  }

  createPos(){
    const data = {
      fullName: this.posForm.value.namePos,
      adress: this.posForm.value.adress,
      tel: this.posForm.value.tel
    };
    this.apiService.createPos(data).subscribe({
      next: (data:any) => {
        console.log('creation reussi de pos', data);
      },
      error: (err) => {
        console.error('erreur de creation de pos',err)
      }
    });
    location.reload();
  }
}
