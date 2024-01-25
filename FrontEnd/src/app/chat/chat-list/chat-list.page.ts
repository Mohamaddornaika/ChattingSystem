// chat-list.page.ts
import { firstValueFrom } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ChatFormComponent } from '../../chat-form/chat-form.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService to get the user ID

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
})
export class ChatListPage implements OnInit {
  activeChats = '';

  constructor(
    private modalController: ModalController,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit() {
    // Call the method to fetch conversations when the component initializes
    this.loadConversations();
  }
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

  private async loadConversations() {
    const conversationsPromise = this.authService.getConversations();
    const conversationsObservable = await conversationsPromise;

    // Now that you have the observable, you can subscribe to it
    conversationsObservable.subscribe(
      (conversations) => {
        // Handle conversations here
        console.log(conversations);
      },
      (error: any) => {
        console.error('Error loading conversations', error);
        // Handle the error
      }
    );
  }
}
