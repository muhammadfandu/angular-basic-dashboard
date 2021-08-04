import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocketioService } from 'src/app/socketio.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  usernameAlreadySelected = false;
  users: any;
  userOptions = <any>[];
  usernameForm: FormGroup;
  messageForm: FormGroup;

  sender: any;
  receiver: any;

  messages = <any>[];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private socketService: SocketioService
  ) {
    this.usernameForm = this.formBuilder.group({
      user: ['', Validators.required],
    });

    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.initUsers();
    this.messages = this.socketService.messages;
    this.getDBUsersData();
  }

  getDBUsersData() {
    this.http.get('http://localhost:8080/api/users').subscribe((response) => {
      if (response) {
        this.userOptions = response;
      }
    });
  }

  chooseUser(user: any) {
    this.sender = user;
    this.initUsers(this.sender);
  }

  initUsers(user: any) {
    this.usernameAlreadySelected = true;
    this.socketService.onUsernameSelection(user.username, user.user_id);

    setTimeout(() => {
      this.getLoggedInUsers();
    }, 1000);
  }

  getLoggedInUsers() {
    this.users = this.socketService.users;

    this.sender = this.users.filter(
      (x: any) => x.username == this.sender.username
    );
    this.sender = this.sender[0];
  }

  setReceiver(receiver: any) {
    this.receiver = receiver;

    console.log(
      'Sending message from ' +
        this.sender.username +
        ' to ' +
        this.receiver.username
    );
  }

  onMessage() {
    let content = this.messageForm.value.message.substring(
      0,
      this.messageForm.value.message.length - 1
    );
    this.messageForm.reset();

    this.socketService.sendPrivateMessage(
      content,
      this.sender.userID,
      this.receiver.userID
    );

    if (this.receiver) {
      console.log(content + ' to ' + this.receiver.username);

      this.messages.push({
        formSelf: true,
        content: content,
        to: this.receiver.userID,
        from: this.sender.userID,
      });
    }
  }

  refreshMessage() {
    this.messages = this.socketService.messages;
  }
}
