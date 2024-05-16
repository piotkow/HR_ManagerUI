import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { LoginApi } from '../../../../libs/api-client';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DividerModule, InputTextModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm? : FormGroup;
  isLoggedIn: boolean = false;
  loginError: string = '';
  passwordVisible = false;

  constructor(
    private formBuilder : FormBuilder,
    private loginApi: LoginApi,
    private authService : AuthService
  ){}

  ngOnInit(): void{
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    
  }

  login() {
    this.loginApi.apiLoginPost(this.loginForm?.value)
      .subscribe((result : {[key : string]: any}) => {
        this.authService.login(result);
      }, (error) => {
        console.error('Login error:', error);
        this.loginError = 'Username or password is incorrect';
      });
  }


  showPassword(){
    this.passwordVisible = !this.passwordVisible;
  }
}
