import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-respo-pos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './respo-pos.component.html',
  styleUrl: './respo-pos.component.scss'
})
export class RespoPosComponent implements OnInit{
  userData!: any;
  data!: any;
  typeEchange: any;
  posData!: any;

  // form
    transactionForm = new FormGroup({
      typeEchangeSource: new FormControl('', Validators.required),
      typeEchangeCible: new FormControl('', Validators.required),
      montantTransaction: new FormControl(0, Validators.required),
      bordereauTransaction: new FormControl('', Validators.required),
    });

  constructor(private apiService: ApiServiceService, private router: Router){ }

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUserData();
    this.getPos();
  }

  getUserData(){
    this.apiService.currentUser.subscribe({
      next: (data:any) => {
        this.userData = data;
        console.log('les data dans respo component:', this.userData);
      },error: () => {
        this.apiService.logout();
      }
    });
  }

  getPos(){
    this.apiService.getAllPos().subscribe({
      next: (data:any) => {
        const dataPos = data.results;
        this.posData = dataPos.find((item: any) => item.list_respo.some((i: any) => i.respo === this.userData.id));
        console.log('pos du respo:', this.posData);
      },error: () => {
        this.apiService.logout();
      }
    });
  }
  // pour les transactions
  transaction(){
    const dataSource = this.posData.list_caisse.find((item:any) => item.id == this.transactionForm.value.typeEchangeSource);
    const dataCible = this.posData.list_caisse.find((item:any) => item.id == this.transactionForm.value.typeEchangeCible);
    const newMontantSource = Number(dataSource.montant) - Number(this.transactionForm.value.montantTransaction);
    const newMontantCible = Number(dataCible.montant) + Number(this.transactionForm.value.montantTransaction);
    const newBordereau = {
      caisse: dataCible.id,
      name: this.transactionForm.value.bordereauTransaction,
    }
    if(newMontantSource >= 0){
      const sourceData = {
        montant: newMontantSource,
      };
      const cibleData = {
        montant: newMontantCible,
      };
      // update du caisse source
      this.apiService.updateCaisse(dataSource.id,sourceData).subscribe({
        next: (dataEditType: any) => {
          console.log('update reussi', dataEditType);
        },
        error: (err) => {
          console.error('erreur de update', err);
        }
      });
      // update du caisse cible
      this.apiService.updateCaisse(dataCible.id,cibleData).subscribe({
        next: (dataEditType: any) => {
          console.log('update reussi', dataEditType);
          this.apiService.createBordereauCaisse(newBordereau).subscribe({
            next: (dataNewBordereau: any) => {
              console.log('new bordereau', dataNewBordereau);
            },
            error: (err) => {
              console.error('erreur de creation de bordereau', err);
            }
          })
        },
        error: (err) => {
          console.error('erreur de update', err);
        }
      });
    }
  }
}
