import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrl: './authenticator.component.css'
})
export class AuthenticatorComponent implements OnInit {
  state = AuthenticatorCompState.LOGIN;
  firebasetsAuth: FirebaseTSAuth;

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  constructor(private snackBar: MatSnackBar, private bottomSheetRef: MatBottomSheetRef){ 
    this.firebasetsAuth = new FirebaseTSAuth();
  }

  ngOnInit(): void {
    
  }

  onResetClick(resetEmail:HTMLInputElement){
    let email = resetEmail.value;
    if(this.isNotEmpty(email)){
      this.firebasetsAuth.sendPasswordResetEmail(
        {
          email: email,
          onComplete: (err) =>{
            this.showSnackBar(`Reset email sent to ${email}`);
            this.bottomSheetRef.dismiss();
          }
        }
      );
    }
  }

  onLogin(loginEmail: HTMLInputElement,
    loginPassword : HTMLInputElement)
    {
      let email = loginEmail.value;
      let password = loginPassword.value;

      if(this.isNotEmpty(email) && this.isNotEmpty(password)) {
        this.firebasetsAuth.signInWith(
          {
            email:email,
            password:password,
            onComplete: (uc) =>{
              this.showSnackBar('Logged In');
              this.bottomSheetRef.dismiss();
            },
            onFail: (err) => {
              this.showSnackBar(err)
            }
          }
        )
      }
    }

  onRegisterClick(
    registerEmail:HTMLInputElement,
    registerPassword:HTMLInputElement,
    registerConfirmPassword:HTMLInputElement)
    {
      let email = registerEmail.value;
      let password = registerPassword.value;
      let confirmPassword = registerConfirmPassword.value;

      if(
        this.isNotEmpty(email) && 
        this.isNotEmpty(password) &&
        this.isNotEmpty(confirmPassword) &&
        this.isAMatch(password, confirmPassword)
      ){

           this.firebasetsAuth.createAccountWith(
        {
          email: email,
          password: password,
          onComplete: (uc) =>{
            this.showSnackBar("Account Created Successfully");
            //   registerEmail.value = "";
            //   registerPassword.value = "";
            //   registerConfirmPassword.value = "";
            this.bottomSheetRef.dismiss();
          },
          onFail: (err) =>{
            this.showSnackBar("Failed to create the account.");
          }
        }
      );       
      }
    }

      isNotEmpty(text : string){
        return text != null && text.length>0;
      }

      isAMatch(text:string, comparedwith:string){
        return text == comparedwith;
      }

  onForgotPasswordClick(){
    this.state = AuthenticatorCompState.FORGOT_PASSWORD
  }

  onCreateAccountClick(){
    this.state = AuthenticatorCompState.REGISTER;
  }

  onLoginClick(){
    this.state = AuthenticatorCompState.LOGIN
  }

  isLoginState(){
    return this.state == AuthenticatorCompState.LOGIN;
  }

  isRegisterState(){
    return this.state == AuthenticatorCompState.REGISTER;
  }

  isForgotPasswordState(){
    return this.state == AuthenticatorCompState.FORGOT_PASSWORD;
  }

  getStatetext(){
    switch(this.state){
      case AuthenticatorCompState.LOGIN:
        return "LOGIN"
      case AuthenticatorCompState.REGISTER:
        return "REGISTERE"
      case AuthenticatorCompState.FORGOT_PASSWORD:
        return "FORGOT PASSWORD";
    }
  }


}

export enum AuthenticatorCompState{
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}
