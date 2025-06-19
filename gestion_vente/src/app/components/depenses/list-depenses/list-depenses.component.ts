import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-depenses',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './list-depenses.component.html',
  styleUrl: './list-depenses.component.scss'
})
export class ListDepensesComponent implements OnInit{
  userDate!: any;
  depenseData!: any;
  allPos!: any;

  selectedPosId!: number;
  selectedPosData!: any;

  allCaisse!: any;

  loadingPage!: boolean;
  error!: string | null;

  loadingSaving!: boolean;
  errorSaving!: string | null;

  newDepenseForm = new FormGroup({
    caisse: new FormControl('', Validators.required),
    montant: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiServiceService, private router: Router){}

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
    this.getAlldepenses();
    this.getAllPos();
    this.getAllCaisse();
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

  getAlldepenses(){
    this.loadingPage = true;
    this.apiService.getAllDepenses().subscribe({
      next: (data: any) => {
        this.loadingPage = false;
        this.depenseData = data.results;
        console.log('all tools', this.depenseData);
      },
      error: (err) => {
        this.loadingPage = false;
        this.error = 'Erreur pendant le telechargement de tools';
      }
    })
  }

  getAllPos(){
    this.apiService.getAllPos().subscribe({
      next: (data: any) => {
        this.allPos = data.results;
        console.log('all pos', this.allPos);
      },
      error: (err) => {
        this.error = 'Erreur pendant le telechargement de pos';
      }
    })
  }

  selectPos(event: Event){
    this.selectedPosId = Number((event.target as HTMLSelectElement).value);
    this.selectedPosData = this.allPos.find((item:any) => item.id === this.selectedPosId);
    console.log('selected POS', this.selectedPosData);
  }

  createDepense(){
    this.loadingSaving = true;
    const data = {
      user: this.userDate.id,
      caisse: this.newDepenseForm.value.caisse,
      description: this.newDepenseForm.value.description,
      montant: this.newDepenseForm.value.montant
    };
    // mis a jour du montant caisse
    const caisseSelected = this.allCaisse.find(
      (item:any) =>
        item.id == this.newDepenseForm.value.caisse
    );
    const newMontantCaisse = {
      montant: caisseSelected.montant - Number(this.newDepenseForm.value.montant),
    };
    const requests = [];
    // joindre les requetes
    const requestDepense = this.apiService.createDepense(data);
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
