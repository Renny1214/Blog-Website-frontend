import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppService } from "../app.service";
import { AuthenticationService } from "../authentication.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-newblog',
  templateUrl: './newblog.component.html',
  styleUrls: ['./newblog.component.css']
})
export class NewblogComponent implements OnInit {

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

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      image : ['', Validators.required],
      content : ['', Validators.required],
      title : ['', Validators.required],
      category: ['', Validators.required],
      blogDescription : ['', Validators.required],  
  });
  }

  get f() { return this.registerForm.controls; }

  title;
  content;
  image;
  category;
  blogDescription;
  access:Boolean=false;
  blogUrl = "http://localhost:10083/blog/createBlog";
  sendData()
  {

    const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({Authorization: 'Basic '+token});
    console.log("hello");
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }    
      let json={
       title:this.title,
       content:this.content,
       image:this.image,
       blogDescription:this.blogDescription,
       category:this.category,
       access: this.access
      }
      this.httpClient.post(this.blogUrl,json,{headers}).subscribe(res=>
        {
            console.log(json);
        });
        alert('SUCCESS!! :-)\nBlog added succefully!');
  }




  url = "http://localhost:10083/user/getMyProfile";
  id;
  getUser()
  {
    const headers=this.authService.addHeaders();
    this.httpClient.get(this.url,{headers}).subscribe((res:any)=>
      {
        this.id = res.id;
      });
  }
  sendId()
  {
      this.router.navigate(["/profile/"+this.id]);
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
