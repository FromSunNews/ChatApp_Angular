import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ActiveEmailComponent } from './components/active-email/active-email.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RequestPasswordComponent } from './components/request-password/request-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent},
  {
    path:'', 
    component: HomeComponent,
    canActivate:[AuthGuard],
    data:{
      permittedRoles:['Admin','User']
    }
  },
  {path:'request-password', component: RequestPasswordComponent},
  {path:'reset-password/:token', component: ResetPasswordComponent},
  {path:'active-email/:token', component: ActiveEmailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
