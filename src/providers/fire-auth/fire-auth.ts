import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from '@firebase/app';
import { Facebook } from '@ionic-native/facebook';

@Injectable()
export class FireAuthProvider {

  constructor(private afAuth: AngularFireAuth, 
    private platform:Platform, 
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
  facebookLogin(){
    if (this.platform.is('cordova')){
      return this.fb.login(['email','public_profile']).then((res) => {
        const fbCredential = firebase.firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return this.afAuth.auth.signInWithCredential(fbCredential);
      })
    } else {
      return this.afAuth.auth.signInWithPopup(new firebase.firebase.auth.FacebookAuthProvider()).then((res) => {
        return res;
      }).catch((e) => {
        return e;
      });
    }
  }

}
