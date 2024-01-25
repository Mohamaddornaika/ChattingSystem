// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { tap, map, catchError } from 'rxjs/operators';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

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
    private jwtHelper: JwtHelperService
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
      throw new Error('Authorization token not found.');
    }

    console.log(userId);
    console.log(authToken);
    const requestBody = {
      token: authToken,
    };

    // Send a POST request with the token in the request body
    return this.http.post(
      `${this.apiUrl}/chat/getAllConversationsForUserWithDetails/${userId}`,
      requestBody
    );
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
        console.log(response);
        const decodedToken = this.jwtHelper.decodeToken(response.token);
        console.log(decodedToken);
        const profilePictureArray = new Uint8Array(
          atob(decodedToken.profilePicture)
            .split('')
            .map((char) => char.charCodeAt(0))
        );
        console.log(decodedToken);
        // Save token and user data to Ionic Storage
        this.storage.set(this.tokenKey, response.token);
        this.storage.set('user-details', {
          ...decodedToken,
          profilePicture: profilePictureArray,
        });
      })
    );
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

  private getHeaders(): HttpHeaders {
    const token = 'MohamadSecureCode1999'; // Replace with the actual token
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
