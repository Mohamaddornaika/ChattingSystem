// chat-list.page.ts
import { firstValueFrom } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ChatFormComponent } from '../../chat-form/chat-form.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService to get the user ID
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
})
export class ChatListPage implements OnInit {
  activeChats = new Array();

  constructor(
    private modalController: ModalController,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer
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
    const conversationsPromise = await this.authService.getConversations();
    conversationsPromise.subscribe(
      async (response: any) => {
        // Handle successful registration
        let convos = await this.authService.getChatOrder(
          response.conversations
        );
        // for (const conversationDetails of convos) {
        //   console.log(conversationDetails.otherUserProfilePicture);
        //   conversationDetails.otherUserProfilePicture = this.getBase64Image(
        //     conversationDetails.otherUserProfilePicture
        //   );
        //   console.log(conversationDetails.otherUserProfilePicture);
        // }
        this.activeChats = convos;
        console.log(convos[0].otherUserProfilePicture);
        console.log(convos[0].otherUserProfilePicture.data);
        // For demonstration purposes, navigate to the login page after registration
      },
      (error) => {
        // Handle registration error
        console.error('Registration failed', error);
      }
    );
  }
  getImageSrc(imageBuffer: number[]): string {
    // Convert the buffer to a base64 string
    const binaryString = String.fromCharCode.apply(null, imageBuffer);
    console.log('Binary String:', binaryString);

    const base64Image = btoa(binaryString);
    console.log('Base64 Image:', base64Image);

    console.log('Base64 Image:', base64Image);
    return `data:image/jpeg;base64,${base64Image}`;
  }
}
