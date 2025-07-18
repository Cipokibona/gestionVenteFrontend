import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-recouvrement',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-recouvrement.component.html',
  styleUrl: './form-recouvrement.component.scss'
})
export class FormRecouvrementComponent implements OnInit{
  userData!: any;
  
  idVente!: any;
  dataVente!: any;
  
  typeEchangeData!: any;
  
  selectedTypeId!: number;
  selectedTypeData!: any;

  recouvrementForm: FormGroup;

  // totalReel!: number;
  totalPaye: number = 0;
  resteImpaye!: number;

  constructor(private apiService: ApiServiceService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder){
    this.recouvrementForm = this.fb.group({
      vente: this.fb.control('', Validators.required),
      typeEchange: this.fb.array([], Validators.required),
      newTypeEchange: this.fb.group({
        id: new FormControl('', Validators.required),
        typeName: new FormControl('', Validators.required),
        montant: new FormControl('', Validators.required),
        bordereau: new FormControl('', Validators.required)
      }),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.idVente = +params['id'];
        this.apiService.getVente(this.idVente).subscribe({
          next: (dataVente:any) => {
            this.dataVente = dataVente;
            this.resteImpaye = this.dataVente.reste;
            console.log('data du vente', this.dataVente);
          },
          error: (err) => {
            console.error('erreur de recuperation du vente', err);
          }
        })
      }
    );
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getTypeEchange();
    console.log('recouvrement Form', this.recouvrementForm.value);
  }

  getUserData(){
    this.apiService.currentUser.subscribe({
      next: (data) => {
        this.userData = data;
        console.log('userDAta', this.userData);
      },
      error: (err) => {
        console.error('erreur de recuperation de dataUser',err);
      }
    })
  }

  getTypeEchange(){
    this.apiService.getTypeEchange().subscribe({
      next: (dataEchange:any) => {
        this.typeEchangeData = dataEchange.results;
        console.log('type echange', this.typeEchangeData);
      },
      error: (err) => {
        console.error('erreur de recuperation de type echange', err);
      }
    })
  }

  selectedTypeEchange(event: Event){
    this.selectedTypeId = Number((event.target as HTMLSelectElement).value);
    this.selectedTypeData = this.typeEchangeData.find((item:any) => item.id === this.selectedTypeId);
    
    console.log('selected type', this.selectedTypeData)
  }

  // recuperations des info dans le form

  get listTypeEchange(): FormArray {
    return this.recouvrementForm.get('typeEchange') as FormArray;
  }

  get newTypeEchange(): FormGroup {
    return this.recouvrementForm.get('newTypeEchange') as FormGroup;
  }

  get typeEchange(): FormArray {
    return this.recouvrementForm.get('typeEchange') as FormArray;
  }

  addTypeEchange() {
    this.listTypeEchange.push(this.fb.group({
      id: this.selectedTypeId,
      typeName: this.selectedTypeData.nom,
      montant: new FormControl(this.newTypeEchange.value.montant, Validators.required),
      bordereau: new FormControl(this.newTypeEchange.value.bordereau, Validators.required)
    }));

    let newPay = 0;
    for(let type of this.listTypeEchange.value){
      newPay += type.montant;
    }
    this.totalPaye = newPay;
    this.resteImpaye = this.dataVente.reste - this.totalPaye;

    // Réinitialiser le FormGroup pour le nouveau produit
    this.newTypeEchange.reset();
    console.log('list des types dans form', this.recouvrementForm.value);
  }

  createRecouvrement(){
    console.log(this.recouvrementForm.value);
    const requests = [];
    for(let pay of this.listTypeEchange.value){
      const dataPay = {
        respo: this.userData.id,
        vente: this.idVente,
        typeEchange: pay.id,
        montant: pay.montant,
        bordereau: pay.bordereau  || 'pas de bordereau',
        }
      const request = this.apiService.createRecouvrement(dataPay);
      requests.push(request);
      // update de vente
      const newDataVente = {
        reste: this.dataVente.reste - pay.montant,
      };
      const requestUpdateVente = this.apiService.updateVente(this.idVente,newDataVente);
      requests.push(requestUpdateVente);
    };
    forkJoin(requests).subscribe({
          next: (resp:any) => {
            this.router.navigate(['/home']);
            console.log('creation reussi', resp);
          },
          error: (err) => {
            console.error('erreur de creation de recouvrement', err);
          }
        });
  }
}
