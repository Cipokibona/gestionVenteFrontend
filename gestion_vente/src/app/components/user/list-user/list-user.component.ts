import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent implements OnInit{
  userData!: any;
  allUser!: any;
  
  allSalaire: any = [];
  allVenteUser!: any;

  lastSalarData!: any;
  depenseSalaire: any = [];

  allPoste!: any;

  loadingPage!: boolean;
  error!: string | null;

  loadingCreation!: boolean;
  errorCreation!: string | null;

  allPos!: any;
  selectedPosData!: any;

  allCaisse!: any;

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

  payForm = new FormGroup({
    caisse: new FormControl('', Validators.required),
    montant: new FormControl(0, Validators.required),
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
    this.getAllPos();
    this.getAllCaisse();
    this.getDepenseSalaire();
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

  getAllCaisse(){
    this.apiService.getAllCaisse().subscribe({
      next: (dataCaisse: any) => {
        this.allCaisse = dataCaisse.results;
        console.log('info caisse', this.allCaisse);
      },
      error: (err) => {
        console.error('erreur de caisse', err);
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

  getDepenseSalaire(){
    this.apiService.getDepenseSalar().subscribe({
      next: (dataDepenseSalar: any) => {
        this.depenseSalaire = dataDepenseSalar.results;
        console.log('info depense salaire', this.depenseSalaire);
      },
      error: (err) => {
        console.error('erreur de depense salaire', err);
      }
    });
  }

  // fonction de dernier salaire et dernier date pay
  getDepenseSalaireUser(id: number){
    const data = this.depenseSalaire.filter((item:any) => item.user_depense == id);
    const lastItem = data[data.length - 1];
    if (!lastItem){
      return null
    }
    return lastItem.montant
  }

  getDateSalaireUser(id: number){
    const data = this.depenseSalaire.filter((item:any) => item.user_depense == id);
    const lastItem = data[data.length - 1];
    if (!lastItem){
      return null
    }
    return lastItem.date
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
  // pos
  getAllPos(){
    this.apiService.getAllPos().subscribe({
      next: (dataVente: any) => {
        this.allPos = dataVente.results;
        console.log('info pos', this.allPos);
      },
      error: (err) => {
        console.error('erreur de pos', err);
      }
    });
  }

  selectedPos(event: Event, id:number){
    const salar = this.getSalarUser(id);
    this.payForm.patchValue({ montant: salar });
    const data = Number((event.target as HTMLSelectElement).value);
    this.selectedPosData = this.allPos.find((item:any) => item.id === data);
    
    console.log('selected type', this.selectedPosData)
  }

  createUser(){
    this.loadingCreation = true;
    let admin = false;
    let respo = false;
    let agent = false;
    if(this.userForm.value.role == 'agent'){
      agent = true
    }
    if(this.userForm.value.role == 'respo'){
      respo = true
    }
    if(this.userForm.value.role == 'admin'){
      admin = true
    }
    if(this.userForm.value.confirmPassword == this.userForm.value.password){
      const newUser = {
      first_name: this.userForm.value.first_name,
      last_name: this.userForm.value.last_name,
      tel: this.userForm.value.tel,
      email: this.userForm.value.email,
      imgProfil: 'No image',
      is_admin: admin,
      is_respo_pos: respo,
      is_agent_commercial: agent,
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
            this.loadingCreation = false;
            console.log('creation salar', dataSalar);
            location.reload();
          },
          error: (err) => {
            this.loadingCreation = false;
            this.errorCreation = 'Erreur pendant l\'operation!!!';
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
        this.loadingCreation = false;
        this.errorCreation = 'Erreur pendant l\'operation!!!';
        console.error('erreur de creation de user',err)
      }
    });
    // location.reload();
    }
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

  // creation pay
  createPay(id: number){
    const newPay = {
      user: this.userData.id,
      caisse: this.payForm.value.caisse,
      montant: this.payForm.value.montant,
      user_depense: Number(id),
      description: 'Pay mensuel',
      is_salaire: true,
    };
    // mis a jour du montant du caisse
    const caisseSelected = this.allCaisse.find(
      (item:any) =>
        item.id == this.payForm.value.caisse
    );
    const newMontantCaisse = {
      montant: caisseSelected.montant - Number(this.payForm.value.montant),
    };
    const requests = [];
    // joindre les requetes
    const requestDepense = this.apiService.createDepense(newPay);
    requests.push(requestDepense);
    const requestUpdateCaisse = this.apiService.updateCaisse(caisseSelected.id,newMontantCaisse);
    requests.push(requestUpdateCaisse);

    forkJoin(requests).subscribe({
      next: (data:any) => {
        console.log('creation de depense', data);
        location.reload();
      },
      error: (err) => {
        console.error('erreur de creation de depense',err)
      }
    });
  }

}
