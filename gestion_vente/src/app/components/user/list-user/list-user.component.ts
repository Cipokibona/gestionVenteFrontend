import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';

@Component({
  selector: 'app-list-user',
  imports: [],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent implements OnInit{
  userData!: any;
  allUser!: any;
  allSalaire!: any;

  loadingPage!: boolean;
  error!: string | null;

  constructor(private apiService: ApiServiceService){}

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
    this.getAllUser();
    this.getAllSalarUser();
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

}
