import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { SessionChat } from './models/sessionchat';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  constructor() { }
  hubConnection!: signalR.HubConnection;

  sessionChatData!:SessionChat;

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${environment.serverOriginUrl}/chatHub`,{
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

    this.hubConnection
    .start()
    .then(() =>{
        // console.log("Hub connection started!");
        // this.askServerListener();
        // this.askServer(); 
    })
    .catch(err =>
      console.error("Error while starting connection: "+err)
    )
  }

  // askServerListener(){
  //   console.log("askServerListener started!");
  //   this.hubConnection.on("askServerResponse",message=>{
  //     console.log("askServerResponse.listener")
  //     console.log(message);
  //   })
    
    
  // }

  // async askServer(){
  //   console.log("askServer started!");
  //   await this.hubConnection.invoke("askServer","hi")
  //   .then(()=> console.log("askServer.then"))
  //   .catch(err => console.error(err));
  //   console.log("This is final prompt!");
  // }

}
