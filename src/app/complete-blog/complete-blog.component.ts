import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppService } from "../app.service";
import { AuthenticationService } from "../authentication.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-complete-blog',
  templateUrl: './complete-blog.component.html',
  styleUrls: ['./complete-blog.component.css']
})
export class CompleteBlogComponent implements OnInit {


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private service: AppService,
    private authService: AuthenticationService,
  ) { }


  url1 = "http://localhost:10083/blog/id/";
  content;
  title;
    blogId;
    array;
    image;
    visited;
    blogDescription;
    user;
    date;
    likes;

    disliked = "https://image.flaticon.com/icons/svg/149/149217.svg";
    liked = "https://image.flaticon.com/icons/svg/148/148836.svg";

    superAccess=false;
  ngOnInit() {

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get("id");
      this.blogId = id;
      this.url = this.url1 + this.blogId;

    });

    this.getBlogs();
    this.getComments(this.blogId);
  }

  getBlogs(){
    this.httpClient.get(this.url).subscribe(res => {
      this.array = res;
      console.log(this.array);
      this.image=this.array.image;
      this.blogId = this.array.blogId;
      this.title = this.array.title;
      this.content = this.array.content;
      this.visited = this.array.visited;
      this.blogDescription = this.array.blogDescription;
      this.date = this.array.date;
      this.user = this.array.users.name;
      this.likes = this.array.likes;

      if(sessionStorage.getItem("userId")==this.array.users.id)
      {
        this.superAccess=true;
      }

      this.getLikedBlogs();
    });

  }

  url = "http://localhost:10083/user/getMyProfile";
  id;

  getUser()
  {
    const headers=this.authService.addHeaders();
    this.httpClient.get(this.url,{headers}).subscribe((res:any)=>
      {
        this.id = res.id;
        sessionStorage.setItem("userId",this.id);
      });
  }
  sendId()
  {
      this.router.navigate(["/profile/"+this.id]);
  }
  blogpage()
    {
      this.router.navigate(["/createBlog"]);
    }

    logoutUrl = "http://localhost:10083/login/logout";
    logout()
    {
  
      if(confirm("you want to logout??"))
      { if(this.service.checkLogin())
        {
          this.authService.logoutService();
          this.httpClient.get(this.logoutUrl).subscribe(res=>
            {
                alert("Logout successful");
            });
         
          this.router.navigate(["/home"]);
        }}
        else{
          alert("ohk");
        }
     
    }
  checkLogin(){
    return this.service.checkLogin();
  }

  deleteComment(id){
    let url="http://localhost:10083/comments/deleteComment/"+id;
    let headers=this.authService.addHeaders();
      if(confirm("you want to delete the comment ?"))
      { this.httpClient.get(url,{headers}).subscribe((res:any)=>{
        alert("Comment deleted");
        this.getComments(this.blogId);
      },error=>{
        alert("Unable to delete comment");
        this.getComments(this.blogId);
      });}
      else{
        alert("ohk");
      }
   
  }


  comments=[];
  comment;

  getComments(id){
    let url="http://localhost:10083/comments/displayCommentsOnBlogs/"+id;
    let headers=this.authService.addHeaders();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.comments=res;
      console.log(this.comments);
    });
  }

  addAComment(){
    if(this.comment != undefined && this.comment != " "){
      let url="http://localhost:10083/comments/addComment/Blog/"+this.blogId;
    let headers=this.authService.addHeaders();

    this.httpClient.post(url,this.comment,{headers}).subscribe((res:any)=>{
      alert("Comment Inserted")
      this.getComments(this.blogId);
    },error=>{
      alert("Comment Inserted")
    });

    this.getComments(this.blogId);
    location.reload();
    }
    else{
      alert("Comment is empty");
    }
  }

  likedBlogs=[];


  setLikesAndDislikes() {
    for (let i = 0; i < this.likedBlogs.length; i++) {
      if (this.likedBlogs[i].blog.blogId != null) {
        var element=document.getElementById(this.likedBlogs[i].blog.blogId);
          if(element != null){
            element.setAttribute("src", this.liked);
          }
      }
    }
  }

  getLikedBlogs() {
    let url = "http://localhost:10083/like/getLikedBlogs";
    let headers = this.authService.addHeaders();
    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      this.likedBlogs = res;
      console.log(this.likedBlogs);
      this.setLikesAndDislikes();
      console.log(res);
    });
  }

  likeBlog(id) {
    var element = document.getElementById(id);

    let url = "http://localhost:10083/like/like/" + id;
    let headers = this.authService.addHeaders();

    this.httpClient.get(url, { headers }).subscribe((res) => {
    
      // console.log(res);
      // var isTrueSet = (res == 'true');

      if (res) {
        element.setAttribute("src", this.liked);
      } else {
        element.setAttribute("src", this.disliked);
      }
      // location.reload();

      this.getBlogs();
    },error => {
      alert(error.message);
    });
  }
}
