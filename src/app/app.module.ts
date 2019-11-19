import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { MainPageComponent } from './main-page/main-page.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { NewblogComponent } from './newblog/newblog.component';
import { MyBlogsComponent } from './my-blogs/my-blogs.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
import { CompleteBlogComponent } from './complete-blog/complete-blog.component';
import { FollowerListComponent } from './follower-list/follower-list.component';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    FrontPageComponent,
    FooterComponent,
    NavbarComponent,
    MainPageComponent,
    MyprofileComponent,
    NewblogComponent,
    MyBlogsComponent,
    EditBlogComponent,
    CompleteBlogComponent,
    FollowerListComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
