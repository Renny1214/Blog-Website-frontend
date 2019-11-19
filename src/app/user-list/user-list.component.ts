import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppService } from "../app.service";
import { AuthenticationService } from "../authentication.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private service: AppService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) { }
  superAccess=false;
  userId;
  id;
  ngOnInit() {
    this.getUsers();

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

  user=[];
  getUsers(){
    let url="http://localhost:10083/user/all";
    let headers=this.authService.addHeaders();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.user=res;
      console.log(this.user);
    });
  }

  follow(id){
    console.log(id);
    let url="http://localhost:10083/follow/sendRequest/";
    const headers = this.authService.addHeaders();
  
    this.httpClient.get(url+id,{headers}).subscribe((res:any)=>{
      if(res){
        if(document.getElementById("id") != null){
          alert("request sent");
        }
      }
      else{
        alert("Request already Sent");
      }
    });
  }

}
