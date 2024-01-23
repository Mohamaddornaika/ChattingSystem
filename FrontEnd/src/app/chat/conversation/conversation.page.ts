// conversation.page.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit {
  conversationId: number = 0;
  messages: {
    senderId: number;
    content: string;
    timestamp: Date;
    userAvatar: string;
  }[] = [];
  newMessage: string = '';
  constructor(private route: ActivatedRoute) {}
  sendMessage() {
    // Add your logic to send the new message
    // For example, you can push the new message into the messages array
    if (this.newMessage.trim() !== '') {
      this.messages.push({
        senderId: 2, // or the appropriate senderId
        content: this.newMessage + '',
        timestamp: new Date(),
        userAvatar: 'assets/avatar1.jpg',
      });
      this.newMessage = ''; // Clear the input field after sending the message
    }
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const conversationIdParam = params.get('chat_id');
      console.log(conversationIdParam);
      if (conversationIdParam) {
        console.log(conversationIdParam);
        this.conversationId = +conversationIdParam;
        // You may fetch conversation details from your service or API here
        // For simplicity, let's populate some dummy messages
        this.messages = [
          {
            senderId: 1,
            content: 'Hello!',
            timestamp: new Date(),
            userAvatar: 'assets/avatar1.jpg',
          },
          {
            senderId: 1,
            content: 'Hello!',
            timestamp: new Date(),
            userAvatar: 'assets/avatar1.jpg',
          },
          {
            senderId: 2,
            content: 'Hi there!',
            timestamp: new Date(),
            userAvatar: 'assets/avatar1.jpg',
          },

          // ... other messages ...
        ];
      } else {
        // Handle the case where 'conversationId' is not provided
      }
    });
  }
}
