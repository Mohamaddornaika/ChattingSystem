// chat-list.page.ts

import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ChatFormComponent } from '../../chat-form/chat-form.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
})
export class ChatListPage {
  activeChats = [
    {
      id: 1,
      userName: 'John Doe',
      userAvatar: 'assets/avatar1.jpg',
      lastMessage: 'Hey, how are you?',
      timestamp: new Date(),
    },
    // Add more sample chat data as needed
  ];

  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  openConversation(userId: number) {
    // Navigate to the conversation page with the selected user's ID
    this.router.navigate(['/conversation', userId]);
  }
  async startNewChat() {
    const modal = await this.modalController.create({
      component: ChatFormComponent,
    });

    modal.onDidDismiss().then((data) => {
      // Handle data returned from the modal if needed
      console.log('Modal dismissed with data:', data);
    });

    return await modal.present();
  }
}
