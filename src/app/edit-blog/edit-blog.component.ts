import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppService } from "../app.service";
import { AuthenticationService } from "../authentication.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private service: AppService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) { }
  registerForm: FormGroup;
  submitted = false;
  blogUrl = "http://localhost:10083/blog/getBlogs/"+sessionStorage.getItem('userId');
  url1 = "http://localhost:10083/blog/id/";
  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      content: ['', Validators.required],
      title: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required],
      blogDescription: ['', Validators.required]
  });
  this.route.paramMap.subscribe((params: ParamMap) => {
    let id = params.get("id");
    this.blogId = id;
    this.url = this.url1 + this.blogId;

  });
  this.httpClient.get(this.url).subscribe(res => {
    this.array = res;
    console.log(this.array);
    this.image=this.array.image;
    this.blogId = this.array.blogId;
    this.title = this.array.title;
    this.content = this.array.content;
    this.blogDescription = this.array.blogDescription;
    this.category = this.array.category;
    this.access = this.array.access;
  });
  }

  

  get f() { return this.registerForm.controls; }

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


  editBlog(blogId)
  {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }   
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({Authorization: 'Basic '+token});

      let editUrl = "http://localhost:10083/blog/updateBlog";
      let json={
        blogId : blogId,
        title : this.title,
        image  : this.image,
        category : this.category,
        blogDescription : this.blogDescription,
        content : this.content,
        access : this.access,
      }

      this.httpClient.post(editUrl,json,{headers}).subscribe(res=>
        {
          console.log(json);
        });   
        alert('SUCCESS!! :-)\nBlog updated succefully!');  
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
}
