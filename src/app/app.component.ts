import { Component } from '@angular/core';
import { SocketioService } from './socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-basic-dashboard';
  sideBarOpen = true;

  constructor(private socketService: SocketioService) {}

  ngOnInit(){
    this.socketService.setupSocketConnection();
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
}
