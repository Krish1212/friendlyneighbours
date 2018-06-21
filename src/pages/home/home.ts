import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private afAuth:FireAuthProvider) {

  }
  signout(){
    this.afAuth.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
