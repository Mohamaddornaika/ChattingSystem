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

    // Set the headers with the Authorization token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    console.log(userId);

    return this.http.get(`${this.apiUrl}/chat/conversationsList/${userId}`, {
      headers,
      withCredentials: true,
    });
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

  // Other methods...

  private getHeaders(): HttpHeaders {
    const token = 'MohamadSecureCode1999'; // Replace with the actual token
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
