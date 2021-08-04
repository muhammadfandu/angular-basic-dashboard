import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  usernameAlreadySelected = false;
  socket: any;
  users: any;
  messages = <any>[];

  constructor() {}

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.emit('my message', 'Hello there from Angular.');

    this.socket.on('users', (users: any) => {
      users.forEach((user: any) => {
        user.self = user.userID;
      });
      this.users = users.sort((a: any, b: any) => {
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    });

    this.socket.on('private message', (content: any, from: any) => {
      this.messages.push({
        fromSelf: false,
        content: content.content,
        from: content.from,
        to: content.to,
      });
    });

    // this.socket.on('user connected', (user: any) => {
    //   // this.users.push(user);
    // });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  onUsernameSelection(username: any, user_id: any) {
    this.usernameAlreadySelected = true;
    this.socket.auth = { username, user_id };
    this.socket.connect();
  }

  sendPrivateMessage(content: any, from: any, to: any) {
    this.socket.emit('private message', {
      content: content,
      from: from,
      to: to,
    });
  }
}
