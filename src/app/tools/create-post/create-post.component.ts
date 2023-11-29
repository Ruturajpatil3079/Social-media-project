import { Component,OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage } from "firebasets/firebasetsStorage/firebaseTSStorage"
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit {
  selectedImageFile: File | undefined;
  selectedImagePreview: string | ArrayBuffer | null = null;

  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  storage = new FirebaseTSStorage();

  constructor( private cdr: ChangeDetectorRef, private dialog: MatDialogRef<CreatePostComponent>  ) { }

  ngOnInit(): void {
    
  }

  // onPhotoSelected(photoSelector : HTMLInputElement,){
  //   this.selectedImageFile = photoSelector.files[0];
  //   if(this.selectedImageFile) return;
  //   let fileReader = new FileReader(); 
  //   fileReader.readAsDataURL(this.selectedImageFile);
  //   fileReader.addEventListener(
  //       "loadend",
  //       ev => {
  //         let readableString = fileReader.result?.toString();
  //         let postPreviewImage = <HTMLImageElement>document.getElementById("post-preview-image");
  //         postPreviewImage.src = readableString;
  //       }
  //   )
  // }

  // onPostClick(commentInput : HTMLTextAreaElement){
  //   let comment = commentInput.value;
  //   let postId = this.firestore.genDocId();
  //   this.storage.upload(
  //     {
  //       uploadName : "upload Image Post",
  //       path : ["Posts",postId,"image"],
  //       data:{
  //         data : this.selectedImageFile
  //       },
  //       onComplete: (downloadUrl) => {
  //         alert(downloadUrl);
  //       }
  //     }
  //   )
  // }

  // onPhotoSelected(photoSelector: HTMLInputElement) {
  //   const files = photoSelector.files;
  
  //   if (!files || files.length === 0) {
  //     return;
  //   }
  
  //   this.selectedImageFile = files[0];
  
  //   let fileReader = new FileReader();
  //   fileReader.readAsDataURL(this.selectedImageFile);
  
  //   fileReader.addEventListener("loadend", (ev) => {
  //     let readableString = fileReader.result as string | null;
  
  //     if (readableString) {
  //       let postPreviewImage = document.getElementById("post-preview-image") as HTMLImageElement | null;
  
  //       if (postPreviewImage) {
  //         postPreviewImage.src = readableString;
  //       }
  //     }
  //   });
  // }

  onPhotoSelected(photoSelector: HTMLInputElement) {
    const files = photoSelector.files;
  
    if (!files || files.length === 0) {
      return;
    }
  
    this.selectedImageFile = files[0];
  
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.selectedImageFile);
  
    fileReader.addEventListener("loadend", (ev) => {
      let readableString = fileReader.result as string | null;
  
      if (readableString) {
        let postPreviewImage = document.getElementById("post-preview-image") as HTMLImageElement | null;
  
        if (postPreviewImage) {
          postPreviewImage.src = readableString;
        }
      }
    });
  }
  
  onPostClick(commentInput: HTMLTextAreaElement) {
    let comment = commentInput.value;
    let postId = this.firestore.genDocId();
    this.storage.upload({
      uploadName: "upload Image Post",
      path: ["Posts", postId, "image"],
      data: {
        data: this.selectedImageFile
      },
      onComplete: (downloadUrl) => {
          // alert("Image uploaded successfully. Download URL: " + downloadUrl);
        this.firestore.create(
          {
            path : ["Posts", postId],
            data:{ 
              comment: comment,
              creatorId: this.auth.getAuth().currentUser!.uid,
              imageUrl: downloadUrl,
              timestamp: FirebaseTSApp.getFirestoreTimestamp(),
             },
             onComplete:(docId) => {
              this.dialog.close();
             }
          }
        )
      },
    });
  }

  
}  

