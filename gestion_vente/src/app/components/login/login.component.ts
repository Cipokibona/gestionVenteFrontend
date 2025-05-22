import { Component } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl  } from '@angular/forms';
import { ApiServiceService } from '../../services/api-service.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loading: boolean = false;
  errorLogging: string | null = null;

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiServiceService, private router: Router){}

  onSubmit() {
    this.loading = true;
    this.errorLogging = null;
    if (this.loginForm.valid) {
      const loginData = {
        username: this.loginForm.value.username || '',
        password: this.loginForm.value.password || '',
      };
      this.login(loginData);
    }
  }

  login(data: any){
    this.apiService.login(data).subscribe({
      next: (data) => {
        this.loading = false;
        const dataToken = jwtDecode<any>(data.access);
        this.apiService.saveToken(data);
        this.apiService.getUser(dataToken.user_id,data);
        this.router.navigate(['/home']);
      },
      error: err => {
        this.loading = false;
        this.errorLogging = 'Erreur de connexion';
        console.error('Erreur de connexion', err);
      }
    })
  }
}
