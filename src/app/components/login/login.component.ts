import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import VadildateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { User } from 'src/app/models/user';
import { SignalrService } from 'src/app/signalr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

  type: string = "password";
  haveText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private spinner: NgxSpinnerService,
    private router: Router,
    private toast: NgToastService,
    private signalrService: SignalrService,

    ) { }
    
    ngOnInit(): void {
      this.auth.authMeListenerSuccess();
      this.loginForm = this.fb.group({
        username:['',Validators.required],
        password:['',Validators.required],
      })
    }

    // toast function
  showSuccess(message:string) {
    this.toast.success({detail:"Success",summary:message,duration:3000});
  }
  
  showError(err: string) {
    this.toast.error({detail:"Error",summary:err,duration:3000});
  }
  
  showInfo() {
    this.toast.info({detail:"Info",summary:'Your Info Message',duration:3000});
  }

  showWarn() {
    this.toast.warning({detail:"Warn",summary:'Your Warn Message',duration:3000});
  }
  // toast function
  
  
  
  hideShowPass(){
    this.haveText = !this.haveText;
    this.haveText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.haveText ? this.type = "text" : this.type = "password";
  }
  
  onLogin(user : User) {
    if(this.loginForm.valid && user != null) {
      //Show the spinner
      this.spinner.show();
      // Send the obj to database
      console.log("user",user)
      this.auth.login(user)
      .subscribe(
        async (res)=>{
          this.spinner.hide();
          if (res) {
            sessionStorage.setItem('user', JSON.stringify(res));
            await this.auth.authMe(res)
            .catch(err=> {
              this.showError(err);
            })
            this.showSuccess('Login Success');
            this.router.navigate(['/']);
          }
        },
        (err)=>{
          this.spinner.hide();
          this.showError(err?.error.message);
          this.loginForm.reset();
        }
        )

    }else{
      //throw the error using toaster with required filed
      VadildateForm.validateAllFormFileds(this.loginForm);
      this.showError("Your form is invalid");
    }
  }
  
  ngOnDestroy(): void {
    this.signalrService.hubConnection.off("authMeResponseSuccess");
  }
}
