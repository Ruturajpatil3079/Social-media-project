import { Component, OnInit,Input } from '@angular/core';
import { PostData } from '../../pages/post-feed/post-feed.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog } from '@angular/material/dialog';
import { ReplyComponent } from '../reply/reply.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  @Input() postData! : PostData;
  creatorName!: string;
  creatorDescription! : string; 

  firestore = new FirebaseTSFirestore();

  constructor( private dialog: MatDialog){ }

  ngOnInit(): void { 
      this.getCreatorInfo();
          }

  // getCreatorInfo(){
  //   this.firestore.getDocument(
  //     {
  //       path : ["Users", this.postData.creatorId],
  //       onComplete: result =>{
  //         let userDocument =  result.data();
  //         this.creatorName = userDocument.publicName;
  //         this.creatorDescription = userDocument.description;

  //       }
  //     }
  //   ) 
  // }

  getCreatorInfo() {
    this.firestore.getDocument({
      path: ["Users", this.postData.creatorId],
      onComplete: (result) => {
        if (result.exists) {
          const userDocument = result.data() as { publicName?: string; description?: string } | undefined;
  
          if (userDocument) {
            this.creatorName = userDocument.publicName || "Default Name";
            this.creatorDescription = userDocument.description || "Default Description";
          }
        } else {
          // Handle the case where the document does not exist
          console.error("Document does not exist");
        }
      },
    });
  }

  onReplyClick(){
    this.dialog.open(ReplyComponent,{data:this.postData.postId});
  }
  
}
