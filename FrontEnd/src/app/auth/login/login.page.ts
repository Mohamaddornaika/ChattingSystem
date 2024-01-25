import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    // Add your registration logic here
    // Validate user input (add additional validation if necessary)
    if (!this.email || !this.password) {
      // Handle validation error (show a message to the user)
      return;
    }

    // Create a FormData object for sending the registration data
    const loginData = {
      email: this.email,
      password: this.password,
    };
    // If a profile picture is selected, append it to the FormData

    // Call the AuthService register method to make the HTTP request
    this.authService.login(loginData).subscribe(
      (response: any) => {
        // Handle successful registration
        console.log('User Logged in successfully', response);
        // For demonstration purposes, navigate to the login page after registration
        this.router.navigate(['/chat-list']);
      },
      (error) => {
        // Handle registration error
        console.error('Logged in failed', error);
      }
    );
  }

  goToRegister() {
    // Navigate to the register page
    this.router.navigate(['/register']);
  }
}
