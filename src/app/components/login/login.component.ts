import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';

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
  ){}

  ngOnInit(): void{
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    
  }

  login() {
    // console.log('Login Form: ', this.loginForm?.value);
    // this.apiService
    //   .request('login', 'post', this.loginForm?.value)
    //   .subscribe((result : {[key : string]: any}) => {
    //     console.log("Login result:", result);
    //     this.authService.login(result);
    //   }, (error) => {
    //     console.error('Login error:', error);
    //     this.loginError = 'Username or password is incorrect';
    //   });
  }


  showPassword(){
    this.passwordVisible = !this.passwordVisible;
  }
}
