import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  // get isLoggedIn(): boolean {
  //   return this.currentUserSubject.value !== null;
  // }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Register
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }


  
  // Logout
  logout() {
    return signOut(this.auth);
  }

  // Save new user to Firestore (Registration)
  saveUser(user: User) {
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userDoc, {
      uid: user.uid,
      email: user.email,
      role: 'user',
      createdAt: new Date().toISOString()
    });
  }

  // Sync user to Firestore (Login) - Backfills existing users
  syncUser(user: User) {
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userDoc, {
      uid: user.uid,
      email: user.email,
      role: 'user',
      lastLogin: new Date().toISOString()
    }, { merge: true });
  }
}
