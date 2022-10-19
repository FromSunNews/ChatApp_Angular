import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import VadildateForm from 'src/app/helpers/validateform';
import { createPasswordStrengthValidator } from 'src/app/helpers/validate_password';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  requestForm!: FormGroup;
  enableComponent: boolean = false;
  token :string = this.route.snapshot.params['token'];
  
  helper:JwtHelperService;

  isLinkActived!: string;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private spinner: NgxSpinnerService,
    private toast: NgToastService,
    private router: Router,
    private route:ActivatedRoute
  ) { 
    this.helper = new JwtHelperService();
  }
  
  showSuccess(message: string) {
    this.toast.success({detail:"Success",summary:message,duration:3000});
  }
  
  showError(err: string) {
    this.toast.error({detail:"Error",summary:err,duration:6000});
  }
  ngOnInit(): void {
    this.isLinkActived = localStorage.getItem('isLinkActived')!;
    if (this.helper.isTokenExpired(this.token)){
      this.showError("This link expired!");
      this.router.navigateByUrl('/login');
    }
    if (this.isLinkActived == this.token){
      this.showError("This link is actived!");
      this.router.navigateByUrl('/login');
    }
    this.requestForm = this.fb.group({
      password:['',
      [Validators.required, Validators.minLength(8),
       createPasswordStrengthValidator()
      ]],
      comfirm_password:['',Validators.required]
    },
    {
      validators: this.MustMatch('password','comfirm_password')
    })
  }
  onUpdatePassword(user:User){
    if(this.requestForm.valid && user!= null) {
      this.enableComponent = !this.enableComponent;
      //Show the spinner
      this.spinner.show();
      const email = this.helper.decodeToken(this.token).email;
      console.log(email);
      user.email = email;
      this.auth.updatePassword(user,this.token)
      .subscribe(
        (res)=>{
          this.spinner.hide();
          if (res) {
            localStorage.setItem('isLinkActived',this.token);
            this.showSuccess("Changed password successfully");
            this.router.navigateByUrl('/login');
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
