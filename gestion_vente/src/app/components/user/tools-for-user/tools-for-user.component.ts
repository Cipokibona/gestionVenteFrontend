import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tools-for-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './tools-for-user.component.html',
  styleUrl: './tools-for-user.component.scss'
})
export class ToolsForUserComponent implements OnInit{
  userDate!: any;
  toolsData!: any;
  allUser!: any;

  loadingPage!: boolean;
  error!: string | null;

  loadingSaving!: boolean;
  errorSaving!: string | null;

  allPos!: any;

  selectedPosData!: any;

  newToolForm = new FormGroup({
    nameTool: new FormControl('', Validators.required),
    user: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  editToolForm = new FormGroup({
    nameOldTool: new FormControl('', Validators.required),
    user: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  depenseToolForm = new FormGroup({
    caisse: new FormControl('', Validators.required),
    montant: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiServiceService, private router: Router){}

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
    this.getAllUser();
    this.getAllPos();
    this.getAllTools();
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

  getAllUser(){
    this.apiService.getAllUser().subscribe({
      next: (data: any) => {
        this.allUser = data.results;
        console.log('all user',this.allUser);
      },
      error: (err) => {
        console.error('erreur de all user', err);
      }
    });
  }

  getAllTools(){
    this.loadingPage = true;
    this.apiService.getAllTools().subscribe({
      next: (data: any) => {
        this.loadingPage = false;
        this.toolsData = data.results;
        console.log('all tools', this.toolsData);
      },
      error: (err) => {
        this.loadingPage = false;
        this.error = 'Erreur pendant le telechargement de tools';
      }
    })
  }

  createTool(){
    this.loadingSaving = true;
    const data = {
      name: this.newToolForm.value.nameTool,
      user: this.newToolForm.value.user,
      description: this.newToolForm.value.description
    };
    this.apiService.createTools(data).subscribe({
      next: (data:any) => {
        this.loadingSaving = false;
        console.log('creation reussi de tool', data);
      },
      error: (err) => {
        this.loadingSaving = false;
        this.errorSaving = 'Erreur';
        console.error('erreur de creation de tool',err)
      }
    });
    location.reload();
  }

  // pos
  getAllPos(){
    this.apiService.getAllPos().subscribe({
      next: (data: any) => {
        this.allPos = data.results;
        console.log('all tools', this.allPos);
      },
      error: (err) => {
        this.loadingPage = false;
        this.error = 'Erreur pendant le telechargement de tools';
      }
    })
  }

  selectedPos(event: Event){
    const id = Number((event.target as HTMLSelectElement).value);
    this.selectedPosData = this.allPos.find((item:any) => item.id === id);
    console.log('selected pos', this.selectedPosData);
  }

  editTool(id: number){
    this.loadingSaving = true;
    const data = {
      name: this.editToolForm.value.nameOldTool,
      user: this.editToolForm.value.user,
      description: this.editToolForm.value.description,
    };
    console.log('data edit',data);
    this.apiService.editTools(id,data).subscribe({
      next: (data:any) => {
        this.loadingSaving = false;
        console.log('edit reussis', data)
      },
      error: (err) => {
        this.loadingSaving = false;
        this.errorSaving = 'Erreur';
        console.error('erreur de edit', err)
      }
    });
    location.reload();
  }

  depenseTool(id: number){
    this.loadingSaving = true;
    const data = {
      user: this.userDate.id,
      caisse: this.depenseToolForm.value.caisse,
      tool: id,
      description: this.depenseToolForm.value.description,
      montant: this.depenseToolForm.value.montant,
      is_tool: true
    };
    console.log('data depense',data);
    this.apiService.createDepense(data).subscribe({
      next: (data:any) => {
        this.loadingSaving = false;
        console.log('depense reussis', data)
      },
      error: (err) => {
        this.loadingSaving = false;
        this.errorSaving = 'Erreur';
        console.error('erreur de depense', err)
      }
    });
    location.reload();
  }
}
