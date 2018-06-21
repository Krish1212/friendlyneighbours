import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { User } from '../../models/user';
import { Profile } from '../../models/userProfile';
import { EmailValidator } from '../../validators/email';

import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { FireStoreProvider } from '../../providers/fire-store/fire-store';

import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  signupForm: FormGroup;
  name:AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  cpassword: AbstractControl;
  gender:AbstractControl;
  address:AbstractControl;
  mobile:AbstractControl;
  loading: Loading;
  user = {} as User;
  userProfile = {} as Profile;
  error: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private frmBuilder:FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private afAuth: FireAuthProvider, 
    private afStore:FireStoreProvider,
    private toastCtrl:ToastController) {
      this.signupForm = this.frmBuilder.group({
        'email': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        'password': ['', Validators.compose([Validators.minLength(6), Validators.required])],
        'cpassword':  ['', Validators.compose([Validators.minLength(6), Validators.required])],
        'name': ['', Validators.compose([Validators.required])],
        'gender': ['', Validators.compose([Validators.required])],
        'address': ['', Validators.compose([Validators.required])],
        'mobile': ['', Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^([0-9]){10}")])],
      });
      this.email = this.signupForm.controls['email'];
      this.password = this.signupForm.controls['password'];
      this.cpassword = this.signupForm.controls['cpassword'];
      this.name = this.signupForm.controls['name'];
      this.gender = this.signupForm.controls['gender'];
      this.address = this.signupForm.controls['address'];
      this.mobile = this.signupForm.controls['mobile'];
  }

  register(){
    this.loading = this.loadingCtrl.create({
      content:'Registration in progress',
      spinner:'bubbles'
    });
    if (this.signupForm.valid){
      this.user = {'email':this.email.value,'password':this.password.value};
      this.userProfile = {'name':this.name.value,'gender':this.gender.value,'address':this.address.value,'mobile':this.mobile.value};
      this.afAuth.registerUser(this.user.email,this.user.password).then(_user_ => {
        this.afStore.addProfile(_user_.uid, this.userProfile).then(_profile_ => {
          this.loading.dismiss().then(() => {
            console.log(_user_);
            console.log(_profile_);
            this.navCtrl.setRoot(LoginPage);
            this.afAuth.logoutUser();
            this.alertCtrl.create({
              message:'Registration successfull. Login to have fun!',
              buttons: [{
                text: 'Ok',
                role: 'cancel'
              }]
            }).present();
          });
        }).catch(_exp_ => {
          console.error(_exp_.message);
        });
      }).catch(_e_ => {
        console.error(_e_.message);
      });
    }
    this.loading.present();
  }
  login(){
    this.navCtrl.setRoot(LoginPage);
  }

}
