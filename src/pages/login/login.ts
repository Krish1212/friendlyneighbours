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
            this.navCtrl.setRoot(HomePage);
          });
        }, _exp_ => {
          console.error(_exp_.message);
        });
      }).catch(_e_ => {
        console.error(_e_.message);
      });
    }
    this.loading.present();
  }
  register(){
    this.navCtrl.setRoot(RegisterPage);
  }

}
