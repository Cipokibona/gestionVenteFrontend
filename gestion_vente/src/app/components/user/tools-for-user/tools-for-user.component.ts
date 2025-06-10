import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tools-for-user',
  imports: [ReactiveFormsModule],
  templateUrl: './tools-for-user.component.html',
  styleUrl: './tools-for-user.component.scss'
})
export class ToolsForUserComponent implements OnInit{
  userDate!: any;
  toolsData!: any;
  allUser!: any;

  loadingPage!: boolean;
  error!: string | null;

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

  constructor(private apiService: ApiServiceService, private router: Router){}

  ngOnInit(): void {
    this.apiService.refreshTokenLocal();
    this.apiService.updateUserLocal();
    this.getUser();
    this.getAllUser();
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
    const data = {
      name: this.newToolForm.value.nameTool,
      user: this.newToolForm.value.user,
      description: this.newToolForm.value.description
    };
    this.apiService.createTools(data).subscribe({
      next: (data:any) => {
        console.log('creation reussi de tool', data);
      },
      error: (err) => {
        console.error('erreur de creation de tool',err)
      }
    });
    location.reload();
  }

  editTool(id: number){
    const data = {
      name: this.editToolForm.value.nameOldTool,
      user: this.editToolForm.value.user,
      description: this.editToolForm.value.description,
    };
    console.log('data edit',data);
    this.apiService.editTools(id,data).subscribe({
      next: (data:any) => {
        console.log('edit reussis', data)
      },
      error: (err) => {
        console.error('erreur de edit', err)
      }
    });
    location.reload();
  }
}
