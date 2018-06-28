import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { EmailValidator } from '../../validators/email';
import { User } from '../../models/user';

import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { FireStoreProvider } from '../../providers/fire-store/fire-store';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  username: AbstractControl;
  password: AbstractControl;
  loading: Loading;
  error: any;
  user = {} as User;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private afAuth: FireAuthProvider, 
    private afStore:FireStoreProvider, 
    private alertCtrl: AlertController) {
      this.loginForm = this.formBuilder.group({
        'username': ['', Validators.compose([Validators.required,EmailValidator.isValid])],
        'password': ['', Validators.compose([Validators.required,Validators.minLength(6)])]
      });
      this.username = this.loginForm.controls['username'];
      this.password = this.loginForm.controls['password'];
  }

  login(){
    this.loading = this.loadingCtrl.create({
      content: 'Loggin in...please wait',
      spinner: 'bubbles'
    });
    if(this.loginForm.valid){
      this.user = {'email':this.username.value,'password':this.password.value};
      this.afAuth.loginUser(this.user.email,this.user.password).then(_user_ => {
        this.afStore.getProfile(_user_.uid).subscribe(_profile_ => {
          this.loading.dismiss().then(() => {
            //console.log(_user_);
            console.log(_profile_);
            this.navCtrl.setRoot(HomePage, {'user':_user_, 'profile':_profile_});
          });
        }, _exp_ => {
          console.error(_exp_.message);
          this.loading.dismiss().then(() => {
            this.alertCtrl.create({
              message:'ERROR: ' + _exp_.message + '!!',
              buttons: [{
                text:'Ok',
                role:'cancel'
              }]
            }).present();
          });
        });
      }).catch(_e_ => {
        console.error(_e_.message);
        this.loading.dismiss().then(() => {
          if(_e_.code == 'auth/user-not-found'){
            this.alertCtrl.create({
              message:'User not found. Please register to login',
              buttons: [{
                text:'Ok',
                role:'cancel'
              }]
            }).present();              
          } else if(_e_.code == 'auth/network-request-failed') {
            this.alertCtrl.create({
              message:_e_.message,
              buttons: [{
                text:'Ok',
                role:'cancel'
              }]
            }).present();
          }
        });
      });
    }
    this.loading.present();
  }
  register(){
    this.navCtrl.setRoot(RegisterPage);
  }
  socialLogin(provider:string){
    switch(provider){
      case 'fb':
        this.afAuth.facebookLogin().then(_user_ => {
          console.log(_user_);
          //console.log(_user_.profile);
          //this.navCtrl.setRoot(HomePage, {'user':_user_.,'profile':})
        }).catch(_e_ => {
          console.error(_e_.message);
        });
      break;
      case 'google':
        this.afAuth.googleLogin().then(_user_ => {
          console.log(_user_);
        }).catch(_e_ => {
          console.error(_e_.message);
        });
      break;
      case 'twitter':
        this.afAuth.twitterLogin().then(_user_ => {
          console.log(_user_);
        }).catch(_e_ => {
          console.error(_e_.message);
        });
      break;
    }
  }

}
