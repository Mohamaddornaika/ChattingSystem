// register.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password1: string = '';
  password2: string = '';
  selectedImage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  register() {
    // Add your registration logic here
    // Validate user input (add additional validation if necessary)
    if (!this.username || !this.email || !this.password1 || !this.password2) {
      // Handle validation error (show a message to the user)
      return;
    }

    // Validate password match
    if (this.password1 !== this.password2) {
      // Handle password mismatch error
      return;
    }

    // Create a FormData object for sending the registration data
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('email', this.email);
    formData.append('password', this.password1);

    // If a profile picture is selected, append it to the FormData
    if (this.selectedImage) {
      const blob = this.dataURItoBlob(this.selectedImage);
      formData.append('profile_picture', blob, 'profile_picture.png');
    }

    // Call the AuthService register method to make the HTTP request
    this.authService.register(formData).subscribe(
      (response: any) => {
        // Handle successful registration
        console.log('User registered successfully', response);
        // For demonstration purposes, navigate to the login page after registration
        this.router.navigate(['/chat-list']);
      },
      (error) => {
        // Handle registration error
        console.error('Registration failed', error);
      }
    );
    // For demonstration purposes, navigate to the login page after registration
  }
  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([int8Array], { type: 'image/png' });
  }
  goToLogin() {
    // Navigate to the login page
    this.router.navigate(['/login']);
  }
  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Process the selected file as needed
      // For example, you can display the selected image in the circular container
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImageClick() {
    // This method will be called when the circular container is clicked
    // You can use it for additional actions related to uploading the image
  }
}
