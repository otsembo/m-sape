import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import firebase from '../../../../utils/firebase'
import { AppResponse } from "../../models/AppResponse";
import {createAccount} from "../../firebase/app_db";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth!: any
  constructor() {
    this.auth = getAuth(firebase.app)
  }

  async createAccount(email: string, password: string, name: string, phone: string): Promise<AppResponse> {
    return await createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (credential: any): Promise<AppResponse> => {
        await createAccount({
          name: name,
          email: email,
          uid: credential.user.uid,
          phone: phone
        })
        return {
          status: 200,
          message: 'success',
          body: credential
        }
      }).catch((reason: any):AppResponse => {
        return {
          status: 500,
          message: 'failed',
          body: reason
        }
      })
  }

  async logInAccount(email: string, password: string): Promise<AppResponse>{
    return await signInWithEmailAndPassword(this.auth, email, password)
      .then((credential: any): AppResponse => {
        return {
          status: 200,
          message: 'success',
          body: credential
        }
      }).catch((reason: any):AppResponse => {
        return {
          status: 500,
          message: 'failed',
          body: reason
        }
      })
  }

}
