import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { AppService } from "../app.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  email;
  password;
  id;
  constructor(
    private httpClient: HttpClient,
    private service: AppService,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    if (this.service.checkLogin()) {
      this.router.navigate(["/home"]);
    }
  }
  validateUser = true;
  login() {
    if (this.email == undefined || this.password == undefined) {
      this.validateUser = false;
    } else {
      this.validateUser = true;
    }
    if (this.validateUser) {
      this.authService.authenticate(this.email, this.password).subscribe(
        data => {
          this.service.isLoggedIn(true);
          console.log("login succesfull");
          this.router.navigate(["/blog"]);
        },
        error => {
          this.validateUser = false;
          console.log("failed");
        }
      );
    }
  }
  showPassword = "password";
  showPasswordFunction() {
    if (this.showPassword == "password") {
      this.showPassword = "text";
    } else {
      this.showPassword = "password";
    }
  }
  url1 = "http://localhost:10083/login/logout";
  logout()
  {

    if(confirm("you want to logout??"))
    { if(this.service.checkLogin())
      {
        this.authService.logoutService();
        this.httpClient.get(this.url1).subscribe(res=>
          {
              alert("Logout successful");
          });
       
        this.router.navigate(["/home"]);
      }}
      else{
        alert("ohk");
      }
   
  }

  checkLogin() {
    return this.service.checkLogin();
  }

  red() {
    this.router.navigate(["/home"]);
  }
  forget()
  {
    let url = "http://localhost:10083/login/forgetPassword";

    let email={
      "email":this.email
    }
    this.httpClient.post(url,email).subscribe((res:any)=>
    {
      if(res)
      {
        alert("Mail has been sent to given mail");
      }
      else{
        alert("mail id not found!");
      }
    }
    )
  }
 
}
