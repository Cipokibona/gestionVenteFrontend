import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-user',
  imports: [ReactiveFormsModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent implements OnInit{
  userData!: any;
  allUser!: any;
  allSalaire!: any;
  allVenteUser!: any;

  loadingPage!: boolean;
  error!: string | null;

  userForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    salaire: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiServiceService){}

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
    this.getAllUser();
    this.getAllSalarUser();
    this.getVenteUser();
  }

  getUser(){
    this.loadingPage = true;
    this.apiService.currentUser.subscribe({
      next: (data: any) => {
        this.loadingPage = false;
        this.userData = data;
        console.log('userdata',this.userData);
      },
      error: (err) => {
        this.loadingPage = false;
        this.error = 'Erreur pendant le telechargement du user';
        console.error('erreur de userdata', err);
      }
    });
  }

  getAllUser(){
    this.loadingPage = true;
    this.apiService.getAllUser().subscribe({
      next: (data: any) => {
        this.loadingPage = false;
        this.allUser = data.results;
        console.log('allusers',this.allUser);
      },
      error: (err) => {
        this.loadingPage = false;
        this.error = 'Erreur pendant le telechargement des users';
        console.error('erreur de allusers', err);
      }
    });
  }

  getTotalWallet(data:any): number {
    return data.reduce((sum: number, article: { montant: number }) => sum + article.montant, 0);
  }

  getAllSalarUser(){
    this.apiService.getAllSalar().subscribe({
      next: (dataPoste: any) => {
        this.allSalaire = dataPoste.results;
        console.log('info salaire', this.allSalaire);
      },
      error: (err) => {
        console.error('erreur de salaire', err);
      }
    });
  }

  getSalarUser(id:number){
    const data = this.allSalaire.find((item:any) => item.user === Number(id));
    if(data){
      console.log('salaire du user',data.montant_poste);
      return data.montant_poste;
    }
  }

  getPostUser(id:number){
    const data = this.allSalaire.find((item:any) => item.user === Number(id));
    if(data){
      return data.post_name;
    }
  }

  getVenteUser(){
    this.apiService.getAllVente().subscribe({
      next: (dataVente: any) => {
        this.allVenteUser = dataVente.results;
        console.log('info vente', this.allVenteUser);
      },
      error: (err) => {
        console.error('erreur de vente', err);
      }
    });
  }

  createUser(){
    const data = {
      fullName: this.userForm.value.first_name,
      adress: this.userForm.value.first_name,
      tel: this.userForm.value.first_name
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
