import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router,NavigationExtras  } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'socialmediaproject';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  private static userDocument: UserDocument;
  // isLoggedIn = false;

  constructor(private loginSheet:MatBottomSheet, private router: Router ){
    this.auth.listenToSignInStateChanges(
      (user) => {
        this.auth.checkSignInState(
          {
          whenSignedIn: user =>{
            // alert("Logged In");
            // this.isLoggedIn = true;
          },
          whenSignedOut: user =>{
            AppComponent.userDocument = null!;
            // alert("Logged Out")
          },
          whenSignedInAndEmailNotVerified:user =>{
            this.router.navigate(["emailVarification"])
          },
          whenSignedInAndEmailVerified:user =>{
            this.getUserProfile();
          },
          whenChanged: user=>{

          }
        })
      }
    )
  }

  public static getUserDocument(){
    return AppComponent.userDocument;
  }

  // getUsername(){
  //   try {
  //     return AppComponent.userDocument.publicName;
  //   } catch (err){
  //     console.log(err)
  //   }
  // }

  getUsername() {
    try {
      if (AppComponent.userDocument) {
        return AppComponent.userDocument.publicName;
      } else {
       
        return "Default Name";
      }
    } catch (err) {
      return "Default Name";
    }
  }
  

  getUserProfile(){
    this.firestore.listenToDocument(
      {
        name : "Getting Document",
        path : ["Users",this.auth.getAuth().currentUser!.uid],
        onUpdate: (result) =>{
          AppComponent.userDocument = <UserDocument>result.data();
          this.userHasProfile = result.exists;
          AppComponent.userDocument.userId = this.auth.getAuth().currentUser!.uid
          if(this.userHasProfile){
            this.router.navigate(["postfeed"])
          }
        }
      }
    );
  }

  // onLogoutClick(){
  //   this.auth.signOut();
  // }

  onLogoutClick() {
    this.auth.signOut();
    
    const navigationExtras: NavigationExtras = {
      replaceUrl: true,
    };
  
    this.router.navigate(['/home'], navigationExtras);
  }
  

  loggedIn(){
    return this.auth.isSignedIn();
  }

  onLoginClick(){
    this.loginSheet.open(AuthenticatorComponent);
  }
}

export interface UserDocument{
  publicName : string;
  description : string;
  userId:string;
}
