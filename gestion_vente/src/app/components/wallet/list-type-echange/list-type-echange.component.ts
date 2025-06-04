import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-type-echange',
  imports: [ReactiveFormsModule],
  templateUrl: './list-type-echange.component.html',
  styleUrl: './list-type-echange.component.scss'
})
export class ListTypeEchangeComponent implements OnInit{
  userDate!: any;
  typeEchangeData!: any;

  loadingPage!: boolean;
  error!: string | null;

  showExchangeRate = false;

  newTypeForm = new FormGroup({
    nameType: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    is_bordereau: new FormControl('', Validators.required),
    is_devise: new FormControl('', Validators.required),
    tauxEchange: new FormControl('', Validators.required),
  });

  editTypeForm = new FormGroup({
    nameType: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    is_bordereau: new FormControl('', Validators.required),
    is_devise: new FormControl('', Validators.required),
    tauxEchange: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiServiceService, private router: Router){}

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
    this.getTypeEchange();
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
    const dataType = {
      nom: this.newTypeForm.value.nameType,
      description: this.newTypeForm.value.description || '',
      is_bordereau: this.newTypeForm.value.is_bordereau || false,
      is_devise: this.newTypeForm.value.is_devise || false,
    };
    console.log('data a envoyer',dataType);
    this.apiService.createTypeEchange(dataType).subscribe({
      next: (data:any) => {
        console.log('creation reussi de type', data);
        if(this.newTypeForm.value.is_devise){
          const dataTaux = {
            devise: data.id,
            taux: this.newTypeForm.value.tauxEchange,
          };
          this.apiService.createTauxEchange(dataTaux).subscribe({
            next: (newTaux:any) => {
              console.log('creation de taux', newTaux)
            },
            error: (err) => {
              console.log('erreur de taux',err);
              this.apiService.deleteTypeEchange(data.id);
            }
          })
        }
      },
      error: (err) => {
        console.error('erreur de creation de type',err)
      }
    });
    // location.reload();
  }

  editType(id: number){
    const data = {
      nom: this.editTypeForm.value.nameType,
      description: this.editTypeForm.value.description || '',
      is_bordereau: this.editTypeForm.value.is_bordereau || false,
      is_devise: this.editTypeForm.value.is_devise || false,
    };
    console.log('data edit',data);
    this.apiService.editTypeEchange(id,data).subscribe({
      next: (data:any) => {
        console.log('edit reussis', data);
        if(this.newTypeForm.value.is_devise){
          const dataTaux = {
            devise: data.id,
            taux: this.newTypeForm.value.tauxEchange,
          };
          this.apiService.createTauxEchange(dataTaux).subscribe({
            next: (newTaux:any) => {
              console.log('creation de taux', newTaux)
            },
            error: (err) => {
              console.log('erreur de taux',err);
              this.apiService.deleteTypeEchange(data.id);
            }
          })
        }
      },
      error: (err) => {
        console.error('erreur de edit', err)
      }
    });
    location.reload();
  }

  onCheckboxChange(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        this.showExchangeRate = checkbox.checked;
    }
}
