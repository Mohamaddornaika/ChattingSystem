// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { tap, map, catchError } from 'rxjs/operators';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private tokenKey = 'MohamadSecureCode1999';
  private storageReady = false;
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    this.initStorage();
  }
  private async initStorage() {
    try {
      // Wait for storage to be ready
      await this.storage.create();
      this.storageReady = true;
    } catch (error) {
      console.error('Error initializing storage', error);
    }
  }
  async getConversations() {
    const userDetails = await this.storage.get('user-details');
    const userId = userDetails.userId;
    const authToken = await this.storage.get(this.tokenKey);

    // Check if the token is available
    if (!authToken) {
      this.router.navigate(['/login']);
      throw new Error('Authorization token not found.');
    }
    console.log(userDetails);
    const requestBody = {
      token: authToken,
    };

    // Send a POST request with the token in the request body
    return this.http.post(
      `${this.apiUrl}/chat/getAllConversationsForUserWithDetails/${userId}`,
      requestBody
    );
  }
  async getMyProfilePc() {
    const userDetails = await this.storage.get('user-details');
    return userDetails.profilePicture;
  }
  async getConversationsWith(user2Id: any) {
    const userDetails = await this.storage.get('user-details');
    const user1Id = userDetails.userId;
    const authToken = await this.storage.get(this.tokenKey);

    // Check if the token is available
    if (!authToken) {
      this.router.navigate(['/login']);
      throw new Error('Authorization token not found.');
    }

    const requestBody = {
      token: authToken,
    };
    console.log(user1Id);
    // Send a POST request with the token in the request body
    return this.http
      .post(
        `${this.apiUrl}/chat/getAllConversationsFor2Users/${user1Id}/${user2Id}`,
        requestBody
      )
      .pipe(
        tap(async (response: any) => {
          console.log(response);
          if (response.conversations.length !== 0) {
            console.log(response.conversations[0].conversation_id);
            const conversation_id = response.conversations[0].conversation_id;
            this.storage.set('conversation_id', {
              conversation_id,
            });
          } else {
            console.log('creating convo');
            await this.startConv(user2Id, user1Id);
          }
        })
      );
  }
  async sentMessage(content: String) {
    const authToken = await this.storage.get(this.tokenKey);
    const conversation_idjson = await this.storage.get('conversation_id');
    ('user-details');
    const user_details = await this.storage.get('user-details');
    const userId = user_details.userId;
    const conversationId = conversation_idjson.conversation_id;
    // Check if the token is available
    if (!authToken) {
      this.router.navigate(['/login']);
      throw new Error('Authorization token not found.');
    }
    console.log(userId);
    const requestBody = {
      content,
      conversationId,
      userId,
      token: authToken,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log(requestBody);
    // Send a POST request with the token in the request body
    return this.http
      .post(`${this.apiUrl}/message/sendMessages`, requestBody, {
        headers,
      })
      .subscribe(
        (response) => {
          console.log('Message sent successfully', response);
          // Handle any additional logic after sending the message
        },
        (error) => {
          console.error('Error sending message', error);
          // Handle the error, if needed
        }
      );
  }
  async getAllMessagesforConv(convoId: any) {
    const authToken = await this.storage.get(this.tokenKey);

    // Check if the token is available
    if (!authToken) {
      this.router.navigate(['/login']);
      throw new Error('Authorization token not found.');
    }

    const requestBody = {
      token: authToken,
    };
    // Send a POST request with the token in the request body
    return this.http.post(
      `${this.apiUrl}/message/messages/${convoId}`,
      requestBody
    );
  }
  async startConv(user2Id: any, user1Id: any) {
    const authToken = await this.storage.get(this.tokenKey);

    // Check if the token is available
    if (!authToken) {
      this.router.navigate(['/login']);
      throw new Error('Authorization token not found.');
    }

    const requestBody = {
      token: authToken,
      user1Id,
      user2Id,
    };
    // Send a POST request with the token in the request body
    return this.http
      .post(`${this.apiUrl}/chat/createConversation`, requestBody)
      .subscribe(
        (response: { [key: string]: any }) => {
          console.log(response);
          const conversation_id = response['conversationId'];
          // console.log(responseSaved.conversations);
          // const conversation_id = response.conversations[0].conversation_id;
          this.storage.set('conversation_id', {
            conversation_id,
          });
          // Handle any additional logic after sending the message
        },
        (error) => {
          console.error('Error sending message', error);
          // Handle the error, if needed
        }
      );
  }
  async getOtherUserId(email: String) {
    const authToken = await this.storage.get(this.tokenKey);

    // Check if the token is available
    if (!authToken) {
      this.router.navigate(['/login']);
      throw new Error('Authorization token not found.');
    }

    const requestBody = {
      token: authToken,
      email,
    };

    // Send a POST request with the token in the request body
    return this.http.post(`${this.apiUrl}/auth/getUserFromEmail`, requestBody);
  }
  async getOtherUserById(userId: String) {
    const authToken = await this.storage.get(this.tokenKey);

    // Check if the token is available
    if (!authToken) {
      this.router.navigate(['/login']);
      throw new Error('Authorization token not found.');
    }

    const requestBody = {
      token: authToken,
      userId,
    };

    // Send a POST request with the token in the request body
    return this.http.post(`${this.apiUrl}/auth/getUserFromUserId`, requestBody);
  }
  register(formData: FormData) {
    return this.http.post(`${this.apiUrl}/auth/register`, formData).pipe(
      tap((response: any) => {
        const decodedToken = this.jwtHelper.decodeToken(response.token);
        console.log(decodedToken);
        const profilePictureArray = new Uint8Array(
          atob(decodedToken.profilePicture)
            .split('')
            .map((char) => char.charCodeAt(0))
        );
        console.log(response);
        // Save token and user data to Ionic Storage
        this.storage.set(this.tokenKey, response.token);
        this.storage.set('user-details', {
          ...response.user,
          profilePicture: profilePictureArray,
        });
      })
    );
  }

  login(loginData: any) {
    // Assuming you get a token after successful login
    return this.http.post(`${this.apiUrl}/auth/login`, loginData).pipe(
      tap((response: any) => {
        const decodedToken = this.jwtHelper.decodeToken(response.token);
        const profilePictureArray = new Uint8Array(
          atob(decodedToken.profilePicture)
            .split('')
            .map((char) => char.charCodeAt(0))
        );
        console.log(decodedToken);
        // Save token and user data to Ionic Storage
        this.storage.set(this.tokenKey, response.token);
        this.storage.set('user-details', {
          email: decodedToken.email,
          userId: decodedToken.userId,
          username: decodedToken.username,
          profilePicture: profilePictureArray,
        });
      })
    );
  }
  logout(): void {
    // Remove the token from storage
    this.storage.remove(this.tokenKey).then(() => {
      // Navigate to the login page
      this.router.navigate(['/login']);
    });
  }
  public async getChatOrder(list: any) {
    const chatOrderArray = [];
    const userDetails = await this.storage.get('user-details');
    const userId = userDetails.userId;
    for (const conversationDetails of list) {
      let otherUserId,
        otherUserUsername,
        otherUserProfilePicture,
        sentOrReceived;
      let lastMessage = conversationDetails.content,
        sent_at = conversationDetails.sent_at;
      // Determine if the current user is the sender or receiver
      if (userId === conversationDetails.sender_id) {
        sentOrReceived = 'sent';
      } else {
        sentOrReceived = 'received';
      }

      // Determine the other user in the conversation
      if (conversationDetails.user1_id === userId) {
        otherUserId = conversationDetails.user2_id;
        otherUserUsername = conversationDetails.user2_username;
        otherUserProfilePicture = conversationDetails.user2_profile_picture;
      } else if (conversationDetails.user2_id === userId) {
        otherUserId = conversationDetails.user1_id;
        otherUserUsername = conversationDetails.user1_username;
        otherUserProfilePicture = conversationDetails.user1_profile_picture;
      } else {
        throw new Error('User not found in the conversation.');
      }
      // Create an object with the required information
      const chatOrderObject = {
        otherUserId,
        sent_at,
        otherUserUsername,
        otherUserProfilePicture,
        sentOrReceived,
        lastMessage,
      };

      // Push the object to the array
      chatOrderArray.push(chatOrderObject);
    }
    // Now, chatOrderArray contains an array of JSON objects with the required information
    console.log('Chat Order Array:', chatOrderArray);
    return chatOrderArray;
  }
}
