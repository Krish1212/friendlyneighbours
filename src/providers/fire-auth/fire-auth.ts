import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from '@firebase/app';

@Injectable()
export class FireAuthProvider {

  constructor(private afAuth: AngularFireAuth) {
      
    }

  loginUser(email:string, password:string):Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email,password);
  }
  registerUser(email:string, password:string):Promise<any>{
    return this.afAuth.auth.createUserWithEmailAndPassword(email,password);
  }
  logoutUser():Promise<any>{
    return this.afAuth.auth.signOut();
  }
  facebookLogin():Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.firebase.auth.FacebookAuthProvider());
  }
  googleLogin():Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.firebase.auth.GoogleAuthProvider());
  }
  twitterLogin():Promise<any>{
    return this.afAuth.auth.signInWithPopup(new firebase.firebase.auth.TwitterAuthProvider());
  }

}
