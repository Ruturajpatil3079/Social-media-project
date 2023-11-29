import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EmailVarificationComponent } from './pages/email-varification/email-varification.component';
import { PostFeedComponent } from './pages/post-feed/post-feed.component';

const routes: Routes = [
  {path:"", component: HomeComponent},
  {path:"emailVarification", component: EmailVarificationComponent},
  {path:"postfeed", component:PostFeedComponent},
  {path:"**", component: HomeComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
