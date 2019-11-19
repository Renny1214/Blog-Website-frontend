import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppService } from "../app.service";
import { AuthenticationService } from "../authentication.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {

  id;
  name ;
  email ;
  bio;
  username;
phone;
  password;
userId;
superAccess=false;
followersLength=0;
followingLength=0;
requests=[];

registerForm: FormGroup;
  submitted = false;
  constructor( private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private service: AppService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder) { }
    
 
  error = false;
  url = "http://localhost:10083/user/getProfile/";

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap)=>{
      let id=params.get("id");
      this.id=id;
    });


    
    this.getUserInfo(this.id);
    console.log(sessionStorage.getItem("userId"));

    if(sessionStorage.getItem("userId")==this.userId)
    {
      this.superAccess=true;
    }
    this.getFollowers();
    this.getRequest();
    this.getFollowing();
  }

  getUserInfo(id){
    this.userId =id;;
    let headers=this.authService.addHeaders();
    this.httpClient.get(this.url+id,{headers}).subscribe((res:any)=>{
      this.username=res.username;
      this.name=res.name;
      this.email=res.email;
      this.phone=res.phone;
      this.bio=res.bio;
      this.password=res.password;
    });

    this.registerForm = this.formBuilder.group({
    username: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(10),Validators.pattern('[0-9]+')]],
    bio: ['', Validators.required], 
  });
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

  myblogs()
  {
    this.router.navigate(["/myblogs/"+this.id]);

  }
  oldpassword;
  newpassword;
  confirmpassword;
  changeBoolean=false;
  
  changePassword()
  {
    if(this.oldpassword==undefined || this.newpassword==undefined || this.confirmpassword==undefined)
    {
      alert("fields are left empty");
    }
    else if(this.password==this.oldpassword)
    {
      if(this.newpassword==this.confirmpassword)
      {
        this.password = this.newpassword;
        this.changeBoolean=true;
        alert("Password changes successfully");
      }
      else
      {
        alert("Confirm password does not match");
      }
    }
    else{
      alert("your current password is incorrect");
    }

  }

  validate=false;
  editUser()
  {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
  } 
      const headers = this.authService.addHeaders();
      let editUrl = "http://localhost:10083/user/editUser";
      let json={
        username : this.username,
        phone : this.phone,
        bio : this.bio,
        password :  this.password,
        email : this.email,
        name :this.name
      }
        if (confirm("Are you sure you want to make the changes?")) {
          this.httpClient.post(editUrl,json,{headers}).subscribe(res=>
            {
              console.log(json);
              alert("changes saved successful")
            });   
      
            this.validate = true;
        
            if(this.changeBoolean==true)
            {
              this.logout();
              this.router.navigate(["/home"]);
            }
        } else {
          alert("ohk");
        }
   
  }


  deactivate = false;
  deactivateUser()
{
  const headers = this.authService.addHeaders();


  let editUrl = "http://localhost:10083/user/deactivateUser";
  let json={
    username : this.username,
      phone : this.phone,
      bio : this.bio,
      password :  this.password,
      email : this.email,
  }

  if (confirm("Are you sure you want to deactivate?")) {
    this.httpClient.post(editUrl,json,{headers}).subscribe(res=>
      {
        console.log(json);
      });   
     this.deactivate = true;
      this.changeBoolean=true;
        if(this.deactivate)
        {
          this.logout();
          this.router.navigate(["/home"]);
        }
  } else {
    alert("ohk!!");
  }


 
}

getFollowers() {
  let url = "http://localhost:10083/follow/getFollowers/"+this.id;
  const headers = this.authService.addHeaders();


  this.httpClient.get(url, { headers }).subscribe((res: any) => {
    let arr = [];
    arr = res;
    this.followersLength = arr.length;
  });


}

follow(){
  let url="http://localhost:10083/follow/sendRequest/"+this.id;
  const headers = this.authService.addHeaders();

  this.httpClient.get(url,{headers}).subscribe((res:any)=>{
    if(res){
      document.getElementById("followButton").innerHTML="Request Sent";
    }
    else{
      alert("Request already Sent");
    }
  });
}

getRequest(){
  let url="http://localhost:10083/follow/getAllRequest";
  const headers = this.authService.addHeaders();


  this.httpClient.get(url,{headers}).subscribe((res:any)=>{
    this.requests=res;
  });
}

acceptRequest(id){
  let url="http://localhost:10083/follow/acceptRequest/"+id;
  const headers = this.authService.addHeaders();

  this.httpClient.get(url,{headers}).subscribe((res:any)=>{
    this.getRequest();
    this.getFollowers();
  });

}

rejectRequest(id){
  let url="http://localhost:10083/follow/declineRequest/"+id;
  const headers = this.authService.addHeaders();

  this.httpClient.get(url,{headers}).subscribe((res:any)=>{
    this.getRequest();
  });
}

getFollowing(){
  let url="http://localhost:10083/follow/getFollowing/"+this.id;
  const headers = this.authService.addHeaders();

  this.httpClient.get(url,{headers}).subscribe((res:any)=>{
    let arr=[];
    arr=res;
    this.followingLength=arr.length;
  });


}

getFollowingRoute(){
  if(this.superAccess){
    //navigate to see list
    this.router.navigate(["/profile/followers/"+this.userId]);
  }
}

getFollowersRoute(){
  if(this.superAccess){
    //navigate to see list
    this.router.navigate(["/profile/followers/"+this.userId]);
  }
}

}
