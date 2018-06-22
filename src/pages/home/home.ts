import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  currentUser:any;
  currUserProfile:any;
  constructor(public navCtrl: NavController, 
    private navParams:NavParams, 
    private afAuth:FireAuthProvider) {
    this.currentUser = this.navParams.get('user');
    this.currUserProfile = this.navParams.get('profile');
  }
  signout(){
    this.afAuth.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
