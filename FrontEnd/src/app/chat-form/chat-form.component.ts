// chat-form.component.ts

import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss'],
})
export class ChatFormComponent {
  newChatUsername: string = '';

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router
  ) {}

  async startChat() {
    this.authService.getOtherUserId(this.newChatUsername);
    const getOtherUserId = await this.authService.getOtherUserId(
      this.newChatUsername
    );
    console.log(getOtherUserId);
    getOtherUserId.subscribe(
      async (response: any) => {
        // Handle successful registration
        console.log(response);
        const navigationExtras: NavigationExtras = {
          state: response.token,
        };
        console.log('userId', response.token.userId);
        this.router.navigate(
          ['/conversation/' + response.token.userId],
          navigationExtras
        );
        this.modalController.dismiss();
      },
      (error) => {
        // Handle registration error
        console.error('Registration failed', error);
      }
    );

    // Your logic here
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
