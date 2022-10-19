import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt'
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
/**
 *
 */
constructor(
  private router:Router,
  private toast: NgToastService
  ) {}

  showError(err: string) {
    this.toast.error({detail:"Error",summary:err,duration:6000});
  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //get user from local storage
    let user = JSON.parse(sessionStorage.getItem('user')!);
    let jwtHelper = new JwtHelperService();
    if (user != null  && user.token != null && !jwtHelper.isTokenExpired(user.token)) {
      let roles = route.data['permittedRoles'] as Array<string>;
      if (user.role != null && roles.length > 0 && roles.includes(user.role.name)) {
          return true;
      }
      else{
        this.showError("You are not allowed to access this page!");
        return false;
      }
    }
    this.showError("You must login first!");
    this.router.navigateByUrl('/login');
    return false;
  }
  
}
