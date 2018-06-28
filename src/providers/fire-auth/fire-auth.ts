import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from '@firebase/app';

@Injectable()
export class FireAuthProvider {

  constructor(private afAuth: AngularFireAuth, 
    private pf:Platform, 
    private fb:Facebook) {
      
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
    if(this.pf.is('cordova')){
      return this.fb.login(['email','public_profile']).then(res => {
        const credential = firebase.firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        this.afAuth.auth.signInWithCredential(credential).then(fbUser => {
          return fbUser;
        }).catch(err => {
          return err;
        });
      });
    } else {
      return this.afAuth.auth.signInWithPopup(new firebase.firebase.auth.FacebookAuthProvider());
    }
  }
  googleLogin():Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.firebase.auth.GoogleAuthProvider());
  }
  twitterLogin():Promise<any>{
    return this.afAuth.auth.signInWithPopup(new firebase.firebase.auth.TwitterAuthProvider());
  }

}
