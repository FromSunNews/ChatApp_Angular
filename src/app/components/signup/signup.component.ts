import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import VadildateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { createPasswordStrengthValidator } from 'src/app/helpers/validate_password';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  type: string = "password";
  haveText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signupForm!: FormGroup;
  emailPattern:string = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private spinner: NgxSpinnerService, 
    private router: Router,
    private toast: NgToastService

    ) { }

    // toast function
  showSuccess(message: string) {
    this.toast.success({detail:"Signup Success",summary:message,duration:3000});
  }
  
  showError(err: string) {
    this.toast.error({detail:"Error",summary:err,duration:6000});
  }

  showInfo() {
    this.toast.info({detail:"Info",summary:'Your Info Message',duration:3000});
  }

  showWarn(warn : string) {
    this.toast.warning({detail:"Warn",summary:warn,duration:3000});
  }
  // toast function





  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email:['',[
        Validators.required,
        Validators.email,
        Validators.pattern(this.emailPattern),
      ]],
      username:['',Validators.required],
      password:['',
      [Validators.required, Validators.minLength(8),
       createPasswordStrengthValidator()
      ]],
      comfirm_password:['',Validators.required]
    },
    {
      validators: this.MustMatch('password','comfirm_password')
    }
    )
  }


  hideShowPass(){
    this.haveText = !this.haveText;
    this.haveText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.haveText ? this.type = "text" : this.type = "password";
  }

  onSignup(user:User){
    if(this.signupForm.valid && user!= null) {
      //Show the spinner
      this.spinner.show();
      user.roleId = 2;
      user.appOriginUrl = environment.appOriginUrl;
      this.auth.signup(user)
      .subscribe(
        (res)=>{
          this.spinner.hide();
          if (res) {
            this.showSuccess('Check your email to active!');
            this.router.navigate(['/login']);
          }
        },
        (err)=>{
          this.spinner.hide();
          this.showError(err?.error.message);
        }
      )

    }else{
      //throw the error using toaster with required filed
      VadildateForm.validateAllFormFileds(this.signupForm);
      this.showError("Your form is invalid");
    }
  }

  MustMatch(controlName:string, matchingControlName:string){
    return (formGroup : FormGroup) =>{
      var control = formGroup.controls[controlName];
      var matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['MustMatch']){
        return
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({MustMatch:true});
    }else{
      matchingControl.setErrors(null)
    }
  }
}
}
