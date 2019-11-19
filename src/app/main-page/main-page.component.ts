import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppService } from "../app.service";
import { AuthenticationService } from "../authentication.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  search1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private service: AppService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getUser();
    this.getBlogs();
    this.getPopular();
    this.getFollowerBlog();
    this.getCategory();
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
  blog=[];
  popularBlog=[];
  followerBlogs=[];
  getBlogs(){
    let url="http://localhost:10083/blog/recent";
    let headers=this.authService.addHeaders();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.blog=res;
      console.log(this.blog);
    });
  }


  getPopular(){
    let url="http://localhost:10083/blog/popular";
    let headers=this.authService.addHeaders();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.popularBlog=res;
      console.log(this.blog);
    });
  }

  getFollowerBlog(){
    let url="http://localhost:10083/blog/followerBlogs";
    let headers=this.authService.addHeaders();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.followerBlogs=res;
      console.log(this.blog);
    });
  }

  search(i)
  {
    let categoryUrl="http://localhost:10083/blog/search/category/"+i;
    let headers=this.authService.addHeaders();

    this.httpClient.get(categoryUrl,{headers}).subscribe((res:any)=>{
      this.blog=res;
      this.followerBlogs =res;
      console.log(this.blog);
    });
  }

  searchinput()
  {
    let categoryUrl="http://localhost:10083/blog/search/"+this.search1;
    let headers=this.authService.addHeaders();

    this.httpClient.get(categoryUrl,{headers}).subscribe((res:any)=>{
      this.blog=res;
      this.followerBlogs =res;
      console.log(this.blog);
    });
  }
  categoriess=[];

  getCategory()
  {
    let url = "http://localhost:10083/blog/getCategory";
    let headers=this.authService.addHeaders();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>
    {
      this.categoriess=res;
      console.log(this.categoriess);
    }
    );
  }

  showUsers()
  {
    this.router.navigate(["/userList"]);

  }
}

