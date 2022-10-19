import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SignalrService } from '../signalr.service';
import { SessionChat } from '../models/sessionchat';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http : HttpClient, private router:Router,
    private signalrService: SignalrService
    ) { 

  }

  signup(user:User):Observable<User>{
    return this.http.post<User>(`${environment.apiHost}/register`,user);
  }

  login(user:User):Observable<User>{
    return this.http.post<User>(`${environment.apiHost}/login`,user);
  }

  sendCoveryLink(user:User):Observable<User>{
    return this.http.post<User>(`${environment.apiHost}/send-recovery-link`,user);
  }

  updatePassword(user: User, token: string){
    let httpHeaders = new HttpHeaders({'Authorization': "Bearer " + token});
    return this.http.put<User>(`${environment.apiHost}/reset-password`,user,{headers:httpHeaders});
  }

  activeEmail(user: User, token: string){
    let httpHeaders = new HttpHeaders({'Authorization': "Bearer " + token});
    return this.http.put<User>(`${environment.apiHost}/active-email`,user,{headers:httpHeaders});
  }

 authMeListenerSuccess() {
    this.signalrService.hubConnection.on("authMeResponseSuccess", (sessionchat:SessionChat) => {
        this.signalrService.sessionChatData = {...sessionchat};
        sessionStorage.setItem("sessionchat",JSON.stringify(sessionchat));
        console.log("authMeResponseSuccess");
    });
}
async authMe(user : User) {
  await this.signalrService.hubConnection.invoke("loginSuccessSignalR", user)
  .then(() => console.log("Loging in attempt..."))
  .catch(err => console.error(err));
}
}
