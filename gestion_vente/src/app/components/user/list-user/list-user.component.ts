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

  allPoste!: any;

  loadingPage!: boolean;
  error!: string | null;

  userForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    poste: new FormControl('', Validators.required),
    role: new FormControl('agent', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiServiceService){}

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
    this.getAllUser();
    this.getAllSalarUser();
    this.getVenteUser();
    this.getAllPoste();
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
    const newUser = {
      first_name: this.userForm.value.first_name,
      last_name: this.userForm.value.last_name,
      tel: this.userForm.value.tel,
      email: this.userForm.value.email,
      imgProfil: 'No image',
      is_admin: false,
      is_respo_pos: false,
      is_agent_commercial: true,
      username: this.userForm.value.username,
      password: this.userForm.value.password,
    };
    console.log('data user envoyer',newUser);
    this.apiService.createUser(newUser).subscribe({
      next: (dataNewUser:any) => {
        console.log('creation reussi de user', dataNewUser);
        const dataSalar = {
          user: dataNewUser.id,
          poste: this.userForm.value.poste,
        }
        this.apiService.createSalar(dataSalar).subscribe({
          next: (dataSalar:any) => {
            console.log('creation salar', dataSalar)
          },
          error: (err) => {
            this.apiService.deleteUser(dataNewUser.id).subscribe({
              error: (err) => {
                console.error('erreur de delete user', err)
              }
            });
            console.error('erreur salar',err)
          }
        })
      },
      error: (err) => {
        console.error('erreur de creation de user',err)
      }
    });
    location.reload();
  }

  getAllPoste(){
    this.apiService.getAllPoste().subscribe({
      next: (dataPoste:any) => {
        this.allPoste = dataPoste.results;
        console.log('tout les postes', this.allPoste);
      },
      error: (err) => {
        console.error('erreur de recuperation de postes',err)
      }
    });
  }

}
