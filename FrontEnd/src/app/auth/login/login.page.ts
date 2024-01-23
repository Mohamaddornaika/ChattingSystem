import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    // Implement your login logic here
    // For simplicity, checking for a hardcoded username and password
    if (this.username === 'user' && this.password === 'password') {
      // Navigate to the chat list page on successful login
      this.router.navigate(['/chat-list']);
    } else {
      // Display an error message or handle unsuccessful login
      console.log('Invalid credentials');
    }
  }

  goToRegister() {
    // Navigate to the register page
    this.router.navigate(['/register']);
  }
}
