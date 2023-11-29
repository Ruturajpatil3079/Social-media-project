import { Component,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from '../../tools/create-post/create-post.component';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.css'
})
export class PostFeedComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  posts : PostData[] = [];

  constructor( private dialog:MatDialog ){}

  onCreatePostClick(){
    this.dialog.open(CreatePostComponent);
  }

  ngOnInit(): void {
    this.getPosts();
    
  }

  getPosts(){
    this.firestore.getCollection(
      {
        path: ["Posts"],
        where:[
          // new Where("creatorId","==","J50WbX4oAyT8zpKTnW1kjQUkZ0F3"),
          new OrderBy("timestamp","desc"),
          new Limit(10),
        ],
        onComplete: (result) =>{
          result.docs.forEach(
            doc => {
              let post = <PostData>doc.data();
              post.postId = doc.id;
              this.posts.push(post);
            }
          )
        },
        onFail: err =>{

        }
      }
    )
  }

}

export interface PostData{
  comment : string;
  creatorId : string;
  imageUrl? : string;
  postId: string;
}
