import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { SessionChat } from 'src/app/models/sessionchat';
import { AuthService } from 'src/app/services/auth.service';
import { SignalrService } from 'src/app/signalr.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {
  
  username!: string;
  sessionchats: Array<SessionChat> = new Array<SessionChat>();

  constructor(
    private auth: AuthService,
    private signalrService: SignalrService,
    private toast: NgToastService,
    private router:Router
  ) { }
  
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

  ngOnInit(): void {
    // let user = JSON.parse(sessionStorage.getItem('user')!);
    this.username = this.signalrService.sessionChatData?.name;

    this.userOnLis();
    this.userOffLis();
    this.logOutLis();
    this.getOnlineUsersLis();

    console.log("onInit");
    this.getOnlineUsersInv();
  }
  

  logOut(): void {
    this.signalrService.hubConnection.invoke("logOut", this.signalrService.sessionChatData?.id)
    .catch(err => console.error(err));
  }
  logOutLis(): void {
    this.signalrService.hubConnection.on("logoutResponse", () => {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('sessionchat');
      this.router.navigateByUrl("/login");
    });
  }


  userOnLis(): void {
    this.signalrService.hubConnection.on("sessionOn", (newSessionChat: SessionChat) => {
      this.sessionchats.push(newSessionChat);
    });
  }
  userOffLis(): void {
    this.signalrService.hubConnection.on("sessionOff", (sessionChatId: string) => {
      this.sessionchats = this.sessionchats.filter(s => s.id != sessionChatId);
    });
  }
  
  getOnlineUsersInv(): void {
    this.signalrService.hubConnection.invoke("getOnlineUsers")
    .catch(err => console.error(err));
  }
  getOnlineUsersLis(): void {
    this.signalrService.hubConnection.on("getOnlineUsersResponse", (SessionChats: Array<SessionChat>) => {
      this.sessionchats = [...SessionChats];
    });
  }

  ngOnDestroy(): void {
    console.log("destroy");
  }
}
