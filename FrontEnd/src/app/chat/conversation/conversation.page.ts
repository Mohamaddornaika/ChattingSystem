// conversation.page.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  conversationId: number = 0;
  profilePic: any;
  messages: {
    senderId: number;
    content: any;
    timestamp: any;
    userAvatar: any;
  }[] = [];
  newMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.content = {} as IonContent;
  }
  scrollToBottom() {
    this.content.scrollToBottom();
  }

  logout() {
    this.authService.logout();
  }
  async sendMessage() {
    if (this.newMessage === '') {
    } else {
      this.authService.getMyProfilePc().then(async (profilePicture) => {
        await this.authService.sentMessage(this.newMessage);
        const senderId = 2;
        const userAvatar = profilePicture;
        const content = this.newMessage;
        const timestamp = new Date();
        const messageSaved = {
          senderId,
          content,
          timestamp,
          userAvatar,
        };
        this.messages.push(messageSaved);
        this.newMessage = '';
        this.scrollToBottom();
      });
    }
    // Add your logic to send the new message
    // For example, you can push the new message into the messages array
  }
  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      const userDetials2 = navigation.extras.state;
      const getConversation = await this.authService.getConversationsWith(
        userDetials2['userId']
      );
      getConversation.subscribe(
        async (response: any) => {
          if (response.conversations.length !== 0) {
            const allMessages = await this.authService.getAllMessagesforConv(
              response.conversations[0].conversation_id
            );
            allMessages.subscribe(
              async (response: any) => {
                // Handle successful registration
                const messages = response.messages;
                this.authService
                  .getMyProfilePc()
                  .then((profilePicture) => {
                    this.profilePic = profilePicture;
                    let senderId, userAvatar;
                    for (const message of messages) {
                      if (userDetials2['userId'] === message.sender_id) {
                        senderId = 1;
                        userAvatar = userDetials2['profilePicture'].data;
                        const content = message.content;
                        const timestamp = new Date(message.sent_at);
                        const messageSaved = {
                          senderId,
                          content,
                          timestamp,
                          userAvatar,
                        };
                        // Push the object to the array
                        this.messages.push(messageSaved);
                        this.messages.sort((a, b) => b.timestamp - a.timestamp);
                      } else {
                        senderId = 2;
                        userAvatar = profilePicture;
                        const content = message.content;
                        const timestamp = new Date(message.sent_at);
                        const messageSaved = {
                          senderId,
                          content,
                          timestamp,
                          userAvatar,
                        };
                        // Push the object to the array
                        this.messages.unshift(messageSaved);
                      }
                    }
                    this.messages.reverse();
                    console.log(this.messages);
                    this.scrollToBottom();
                  })
                  .catch((error) => {
                    console.error('Error fetching profile picture:', error);
                  });
              },
              (error) => {
                // Handle registration error
                console.error('Registration failed', error);
              }
            );
          }
        },
        (error) => {
          // Handle registration error
          console.error('Registration failed', error);
        }
      );
      //if senderId==navigation.extras.state.userID then its 1
    } else {
      this.route.paramMap.subscribe((params) => {
        // Use params.get('paramName') to get the value of a specific parameter
        const userId = params.get('userId');
        console.log('User ID:', userId);

        // Add your logic here based on the received parameter
      });
      console.warn('Navigation extras not available.');
    }
    this.route.paramMap.subscribe((params) => {
      const conversationIdParam = params.get('chat_id');
      console.log(conversationIdParam);
      if (conversationIdParam) {
        console.log(conversationIdParam);
        this.conversationId = +conversationIdParam;
        // You may fetch conversation details from your service or API here
        // For simplicity, let's populate some dummy messages
      } else {
        // Handle the case where 'conversationId' is not provided
      }
    });
  }
  getImageSrc(imageBuffer: number[]): string {
    // Convert the buffer to a base64 string

    const binaryString = String.fromCharCode.apply(null, imageBuffer);
    const base64Image = btoa(binaryString);
    return `data:image/jpeg;base64,${base64Image}`;
  }
}
