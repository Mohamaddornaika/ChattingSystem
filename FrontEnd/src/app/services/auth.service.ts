// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { tap } from 'rxjs/operators';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

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
    const token = 'MohamadSecureCode1999';
    return this.http.post(`${this.apiUrl}/auth/login`, loginData).pipe(
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

  // Other methods...

  private getHeaders(): HttpHeaders {
    const token = 'MohamadSecureCode1999'; // Replace with the actual token
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
