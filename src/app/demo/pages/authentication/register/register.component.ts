// angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../../../services/auth.service';
import {  ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  model = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  }
   
  isLoading=false;
  constructor(private auth:AuthService){}

  onSubmit(){
    this.isLoading=true;  
  
const userObj= {
  email: `${this.model.email}`,
  password: `${this.model.password}`,
  displayName: `${this.model.firstName} ${this.model.lastName}`
}

this.auth.registerUser(userObj).subscribe({
  next:(res)=>{
    this.isLoading=false;
    alert('Registration Successful');
    console.log('Registration Successful', res);
  },
  error:(err)=>{
    this.isLoading=false;
    alert(err.error?.message || 'Registration Failed');
    console.error('Registration Failed', err);
  }
})

}

}
