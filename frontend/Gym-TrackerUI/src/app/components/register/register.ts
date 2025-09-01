import { Component } from '@angular/core';
import { Auth } from '../../service/auth';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  registerError: string | null = null;

  registerForm:FormGroup| undefined;

  constructor(
    private service:Auth,
    private fb:FormBuilder,
    private router: Router
  ){}
emailAsyncValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
    return this.service.checkEmailExists(control.value).pipe(
      map(exists => (exists ? { emailTaken: true } : null))
    );
  };
}
  ngOnInit(){
    this.registerForm=this.fb.group({
      firstName :['',Validators.required],
      lastName :['',Validators.required],
      email :['', 
    [Validators.required, Validators.email],      
    [this.emailAsyncValidator()]                  
  ],
      password :['',Validators.required],
      confirmPassword :['',Validators.required]

    },{validator:this.passwordMatchValidator})
  }

  private passwordMatchValidator(fg:FormGroup){
    const password=fg.get('password')?.value;
    const confirmPassword=fg.get('confirmPassword')?.value;
    if(password!=confirmPassword){
      fg.get("confirmPassword")?.setErrors({passwordMissmatch:true});

    }else{
      fg.get("confirmPassword")?.setErrors(null)
    }

  }
  register() {
  console.log(this.registerForm.value);
  this.service.register(this.registerForm.value).subscribe({
    next: (response) => {
      console.log(response);
      this.registerError = null; // resetuj grešku ako je uspešno
      this.router.navigate(['/login']); // redirect na login
    },
    error: (err) => {
      console.error(err);
      // postavi poruku greške koja će se prikazati u HTML
      if (err.error?.message) {
        this.registerError = err.error.message;
      } else {
        this.registerError = 'Registration failed. Please try again.';
      }
    }
  });
}

}
