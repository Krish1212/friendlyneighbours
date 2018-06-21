import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

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

}
