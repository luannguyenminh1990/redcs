import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import { LocalService } from './local.service';
import { CrudService } from './crud.service';
import { iUser } from '../interfaces/user.interface';
import { AppService } from './app.service';
import { LoadingService } from './loading.service';
// import { AngularFireService } from './af.service';

@Injectable()


export class AuthService {
    isSigned: boolean = false;
    uid: string;
    email: string;
    constructor(
        // private afService: AngularFireService
        private localService: LocalService,
        private crudService: CrudService,
        private appService: AppService,
        private loadingService: LoadingService
    ) { }

    signIn(email: string, pass: string) {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(email, pass)
                .then((res) => {
                    console.log(res);
                    this.localService.USER_FB = res;
                    return this.crudService.getUserProfile(res.user.uid)
                })
                .then((docSnap)=>{
                    let USER = <iUser>docSnap.data();
                    console.log(USER);
                    this.localService.USER = USER;
                    resolve({MSG: 'logged in', USER: USER, FB_USER: this.localService.USER_FB})
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }


    signUp(email: string, pass: string) {
        return firebase.auth().createUserWithEmailAndPassword(email, pass)
        // return new Promise((resolve, reject)=>{
        //     firebase.auth().createUserWithEmailAndPassword(email, pass)
        //     .then((res)=>{
        //         console.log(res);
        //         resolve({MSG: 'login success', res: res})
        //     })
        //     .catch((err)=>{
        //         reject(err);
        //     })
        // })
    }

    signOut(): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.auth().signOut()
                .then(() => {
                    this.localService.USER_FB = null;
                    this.localService.USER = null;
                    this.localService.USER_ID = null;
                    this.uid = null;
                    this.isSigned = false;
                    resolve({ MSG: 'logged out' })
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    resetAccount(email: string): Promise<any> {
        return firebase.auth().sendPasswordResetEmail(email);
    }

    isUserSignedIn() {
        if (firebase.auth().currentUser) {
            this.isSigned = true;
            this.uid = firebase.auth().currentUser.uid;
            this.localService.USER_ID = firebase.auth().currentUser.uid;
            console.log(this.uid);
            return true;
        } else {
            this.localService.USER_ID = null;
            this.isSigned = false;
            console.log('not signed')
            return false;
        }
    }

    checkIfUserSignIn(){
        return new Promise((resolve, reject)=>{
            this.loadingService.startLoading();
            setTimeout(() => {
                let state = this.isUserSignedIn();
                resolve({isSigned: state});
                this.loadingService.hideLoading();
            }, 3000);
        })
        
    }

    verifyAccount() {
        let user = firebase.auth().currentUser;
        return user.sendEmailVerification()
    }

    // accountSignUp(EMAIL: string, PASSWORD: string) {
    //     return new Promise((resolve, reject) => {
    //         this.authService.signUp(EMAIL, PASSWORD)
    //         .then((res) => {
    //             // update to DB Accounts
    //             let USER_ID = res.uid;
    //             let PROFILE: iProfile = {
    //                 PROFILE_AVATAR_URL: '',
    //                 PROFILE_NAME: 'No Name',
    //                 PROFILE_EMAIL: EMAIL,
    //                 PROFILE_BIRTHDAY: '',
    //                 PROFILE_TEL: '',
    //                 PROFILE_ADDRESS: '',
    //                 PROFILE_STATE: '',
    //                 PROFILE_VERIFIED: false,
    //                 PROFILE_UID: USER_ID,
    //                 PROFILE_PROVIDER: 'Email',
    //                 PROFILE_IDENTIFIER: '',
    //                 PROFILE_CREATED: Date.now().toString(),
    //                 PROFILE_OTHERS: null
    //             }
    //             console.log(res, PROFILE);
    //             this.dbService.insertAnObjectAtNode('UserProfiles/' + USER_ID, PROFILE).then(() => {
    //                 resolve({ PROFILE: PROFILE, message: 'Success' });
    //             })
    //                 .catch((err) => {
    //                     reject(err);
    //                 })
    //         })
    //         .catch((err)=>{
    //             this.appService.alertError('Failed', err.message);
    //         })
    //     })
    // }

    // checkIfUserIsAdmin(userEmail: string) {
    //     return new Promise((resolve, reject) => {
    //         var isAdmin = false;
    //         this.afService.getList('Admins/')
    //             .subscribe((listUsers: any[]) => {
    //                 console.log(listUsers);
    //                 listUsers.forEach(user => {
    //                     console.log(user, userEmail);
    //                     if (user.email === userEmail) {
    //                         isAdmin = true;
    //                     }
    //                 });
    //                 if(isAdmin){
    //                     resolve(true)
    //                 }else{
    //                     resolve(false);
    //                 }
    //             })
    //     })
    // }

    // getUserID(EMAIL: string){
    //     console.log('test get UID');
    //     firebase.auth().fetchProvidersForEmail(EMAIL).then((res)=>{
    //         console.log(res);
    //     })
    // }





}