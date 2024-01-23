// register.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  register() {
    // Add your registration logic here

    // For demonstration purposes, navigate to the login page after registration
    this.router.navigate(['/login']);
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
