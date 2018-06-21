import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { Profile } from '../../models/userProfile';
import { map } from 'rxjs/operators';

@Injectable()
export class FireStoreProvider {
  collectionRef:AngularFirestoreCollection<Profile>;
  uProfile: Observable<Profile>;
  constructor(private afAuth:AngularFireAuth, 
    private afStore:AngularFirestore) {
      this.collectionRef = this.afStore.collection<Profile>(`users`);
  }

  getProfile(uid:string):Observable<any> {
    if (this.afAuth.auth.currentUser){
      return this.collectionRef.doc(`${uid}`).snapshotChanges().pipe(
        map(a => {
          const data = a.payload.data();
          data.id = a.payload.id;
          return data;
        })
      );
    }
  }

  addProfile(id:string, profile:Profile):Promise<any>{
    return this.collectionRef.doc(`${id}`).set(profile);
  }

  updateProfile(){

  }

  deleteProfile(){

  }

}
