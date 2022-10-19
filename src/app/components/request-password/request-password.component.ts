import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import VadildateForm from 'src/app/helpers/validateform';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.css']
})
export class RequestPasswordComponent implements OnInit {

  requestForm!: FormGroup;
  disenableComponent: boolean = false;
  emailPattern:string = environment.emailPatern;
  
  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private spinner: NgxSpinnerService,
    private toast: NgToastService
    
    ) { }
  ngOnInit(): void {
    this.requestForm = this.fb.group({
      email:['',[
        Validators.required,
        Validators.email,
        Validators.pattern(this.emailPattern),
      ]]
    })
  }

    // toast function
  showSuccess(message: string) {
    this.toast.success({detail:"Success",summary:message,duration:3000});
  }
  
  showError(err: string) {
    this.toast.error({detail:"Error",summary:err,duration:6000});
  // toast function
  }

  onRequest(user :User){
    if(this.requestForm.valid && user!= null) {
      //Show the spinner
      this.spinner.show();
      user.appOriginUrl = environment.appOriginUrl;
      this.auth.sendCoveryLink(user)
      .subscribe(
        (res)=>{
          this.spinner.hide();
          if (res) {
            this.disenableComponent = ! this.disenableComponent;
            this.showSuccess('Please check your email address!');
          }
        },
        (err)=>{
          this.spinner.hide();
          this.showError(err?.error.message);
        }
      )

    }else{
      //throw the error using toaster with required filed
      VadildateForm.validateAllFormFileds(this.requestForm);
      this.showError("Your form is invalid");
    }
  }
}
