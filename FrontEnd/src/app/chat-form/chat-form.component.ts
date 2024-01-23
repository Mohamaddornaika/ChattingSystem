// chat-form.component.ts

import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss'],
})
export class ChatFormComponent {
  newChatUsername: string = '';

  constructor(private modalController: ModalController) {}

  startChat() {
    // Your logic here
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
