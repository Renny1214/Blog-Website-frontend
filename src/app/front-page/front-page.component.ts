import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { AuthenticationService } from '../authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {

  constructor(private httpClient : HttpClient , private router: Router , private route : ActivatedRoute ,private service : AppService ,private authService:AuthenticationService,private formBuilder: FormBuilder) {}

  public hasColor = true;
  ngOnInit() {
    this.changeColor();
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


  changeColor(){
      window.setInterval(()=>{
        if(this.hasColor==true){
          this.hasColor=false;
        }
        else{
          this.hasColor=true;
        }
      },3000);
    
    }
    login()
    {
     this.router.navigate(['/login']);
    }
    signup()
    {
     this.router.navigate(['/signup']);
    }
    red(){
     this.router.navigate(['/home']);
    }

    home()
    {
      if(this.checkLogin())
      {
        this.router.navigate(['/blog']);

      }
      else
      {
        this.login();
      }
    }
  }

  
