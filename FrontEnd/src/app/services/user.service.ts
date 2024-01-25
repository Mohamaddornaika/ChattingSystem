import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: any): void {
    this.userSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUser(): any {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }

  clearUser(): void {
    this.userSubject.next(null);
    localStorage.removeItem('currentUser');
  }
}
