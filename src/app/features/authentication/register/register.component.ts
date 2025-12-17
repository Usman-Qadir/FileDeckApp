import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  // Angular Signals
  isLoading = signal(false);
  showPassword = signal(false);

  // Strongly typed reactive form (Angular 14+ ✨)
  registerForm: FormGroup<{
    firstName:     import('@angular/forms').FormControl<string>;
    lastName:      import('@angular/forms').FormControl<string>;
    email:         import('@angular/forms').FormControl<string>;
    password:      import('@angular/forms').FormControl<string>;
    agree:         import('@angular/forms').FormControl<boolean>;
  }>;

  constructor(private fb: NonNullableFormBuilder, private auth: AuthService) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName:  ['', [Validators.required, Validators.minLength(2)]],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.minLength(6)]],
      agree:     [true, Validators.requiredTrue]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const userObj = {
      email: this.f.email.value,
      password: this.f.password.value,
      displayName: `${this.f.firstName.value} ${this.f.lastName.value}`
    };

    this.auth.registerUser(userObj).subscribe({
      next: () => {
        this.isLoading.set(false);
        alert('Registration Successful');
      },
      error: (err) => {
        this.isLoading.set(false);
        alert(err.error?.message || 'Registration Failed');
      }
    });
  }
}
