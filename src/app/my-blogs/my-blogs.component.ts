import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppService } from "../app.service";
import { AuthenticationService } from "../authentication.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-blogs',
  templateUrl: './my-blogs.component.html',
  styleUrls: ['./my-blogs.component.css']
})
export class MyBlogsComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  id;

  blogUrl = "http://localhost:10083/blog/getBlogs/";
  blogId;
  date;
  category;
  image;
  content;
  blogDescription;
  title;
  access;
  blogs=[];
  array;

  userId;
superAccess=false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private service: AppService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) { }
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      content: ['', Validators.required],
      title: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required],
      blogDescription: ['', Validators.required]
  });
  this.route.paramMap.subscribe((params: ParamMap)=>{
    let id=params.get("id");
    this.id=id;
  });


  console.log(sessionStorage.getItem("userId"));
  console.log(this.id);
  if(sessionStorage.getItem("userId")==this.id)
  {
    this.superAccess=true;
  }

  this.route.paramMap.subscribe((params:ParamMap)=>{
    let id = params.get("id");
    this.id=id;
    this.blogUrl=this.blogUrl+id;
    console.log(this.blogUrl);
  }
  )

  this.ajaxCall();
  }
  get f() { return this.registerForm.controls; }
 
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
 

  ajaxCall(){
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: 'Basic '+token});

    console.log(this.blogUrl);
    console.log(this.id);
    this.httpClient.get(this.blogUrl,{headers}).subscribe(res => {
      this.array = res;  

      this.array.forEach(element => {
        this.blogId = element.blogId;
       this.category = element.productId;
        this.image = element.name;
        this.content = element.products;
         this.blogDescription= element.blogDescription;
        this.title = element.title;
        this.access = element.access;
       });
    });
  }
  getTitleAndDescription(title,desc){
    this.title=title;
    this.content=desc;
  }

  deleteBlogUrl= "http://localhost:10083/blog/deleteBlog";
  deleteBlog(id)
  {
    let headers=this.authService.addHeaders();

    let url = this.deleteBlogUrl+"/"+id;

    

      if (confirm("Are you sure you want to delete the blog?")) {
        this.httpClient.get(url,{headers}).subscribe(res=>
          {
            console.log(res);
            this.ajaxCall();
            alert("blog deleted")
          });
      } else {
        alert("ohk");
      }
  }


 
  editblog()
  {
    this.router.navigate(["/editblog"]);

  }
  addBlog()
  {
    this.router.navigate(["/createBlog"]);
  }
  
}
