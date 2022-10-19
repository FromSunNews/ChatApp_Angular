import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-active-email',
  templateUrl: './active-email.component.html',
  styleUrls: ['./active-email.component.css']
})
export class ActiveEmailComponent implements OnInit {

  token :string = this.route.snapshot.params['token'];
  
  helper:JwtHelperService;

  isEmailActived!: string;

  constructor(
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
    this.isEmailActived = localStorage.getItem('isEmailActived')!;
    if (this.helper.isTokenExpired(this.token)){
      this.showError("This link expired!");
      this.router.navigateByUrl('/login');
      return;
    }
    if (this.isEmailActived == this.token){
      this.showError("This email is actived!");
      this.router.navigateByUrl('/login');
      return;
    }
    let user = new User();
    this.spinner.show();
      const email = this.helper.decodeToken(this.token).email;
      user.email = email;
      this.auth.activeEmail(user,this.token)
      .subscribe(
        (res)=>{
          this.spinner.hide();
          if (res) {
            localStorage.setItem('isEmailActived',this.token);
            this.showSuccess("Your email actived successfully!");
            this.router.navigateByUrl('/login');
          }
        },
        (err)=>{
          this.spinner.hide();
          this.showError(err?.error.message);
        }
      )
  }

}
