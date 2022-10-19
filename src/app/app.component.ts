import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrService } from './signalr.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit ,OnDestroy {
  title = 'AngularAuthUI';
  constructor(
    private signalrService: SignalrService,

  ){}
  ngOnInit() {
    this.signalrService.startConnection();
  }
  ngOnDestroy(): void {
    
  }
}
