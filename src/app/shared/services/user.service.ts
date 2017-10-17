import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import * as firebase from 'firebase';
import { User } from '../../shared/models/user';

@Injectable()
export class UserService {
  private uid: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) {
  }

  get currentUser(): Observable<User|null> {
    return this.afAuth.authState.switchMap((fbUser: firebase.User) => {
      if (!fbUser) {
        return Observable.of(null);
      }
      this.uid = fbUser.uid;
      return this.db.object(`users/${fbUser.uid}`);
    });
  }

  setCurrentFlockId(flockId: string) {
    const ref = this.db.object(`users/${this.uid}`);
    return ref.update({ currentFlockId: flockId});
  }

  signUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.updateUserData(user);
      });
  }

  signIn(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error));
  }

  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  private updateUserData(user: firebase.User): void {
    const path = `users/${user.uid}`;
    const data = {
      email: user.email,
      name: user.displayName
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }
}
