import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  loadingPage!: boolean;
  error!: string | null;

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
    const data = {
      user: this.userDate.id,
      caisse: this.newDepenseForm.value.caisse,
      description: this.newDepenseForm.value.description,
      montant: this.newDepenseForm.value.montant
    };
    console.log('data a envoyer',data);
    this.apiService.createDepense(data).subscribe({
      next: (dataDepense:any) => {
        console.log('creation reussi de depenses', dataDepense);
      },
      error: (err) => {
        console.error('erreur de creation de depense',err)
      }
    });
    location.reload();
  }
}
