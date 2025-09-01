import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../service/auth';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './login.html'
})
export class Login implements OnInit {

  loginForm: FormGroup;  
  loginError: boolean = false;  // <-- dodaj ovo

  constructor(private fb: FormBuilder, private service:Auth, private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.service.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log(response);
          if (response.jwt) {
            // Sačuvaj token i obavesti BehaviorSubject
            this.service.saveToken(response.jwt);
            
            // Navigacija na dashboard
            this.router.navigateByUrl('/dashboard');
            this.loginError = false; // resetuj grešku
          } else {
            // Ako nema JWT u odgovoru, prikaži grešku
            this.loginError = true;
          }
        },
        error: (err) => {
          console.error(err);
          this.loginError = true; // prikaži grešku ako server vrati error
        }
      });
    } else {
      console.warn('Form is invalid!');
      this.loginError = true; // opcionalno, ako želiš da pokažeš grešku i za invalid formu
    }
  }
}
