import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-follower-list',
  templateUrl: './follower-list.component.html',
  styleUrls: ['./follower-list.component.css']
})
export class FollowerListComponent implements OnInit {


  id;
  followers=[];
  following=[];

  constructor(private route: ActivatedRoute,
    private service: AppService,
    private router: Router,
    private httpClient: HttpClient,
    private auth: AuthenticationService) { }

  ngOnInit() {
    if (!this.service.checkLogin()) {
      this.router.navigate(["/starter-page"]);
    }

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get("id");
      this.id = id;
      console.log(this.id);
    });

    this.getFollowers();
    this.getFollowing();
  }

  getFollowers(){
    let url="http://localhost:10083/follow/getFollowers/"+this.id;
    let headers=this.auth.addHeaders();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.followers=res;
    });
  }

  removeFromFollowers(id){
    let url="http://localhost:10083/follow/declineRequest/"+id;
    let headers=this.auth.addHeaders();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.getFollowers();
    });
  }

  getFollowing(){
    let url="http://localhost:10083/follow/getFollowing/"+this.id;
    let headers=this.auth.addHeaders();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.following=res;
    });
  }

  unFollow(id){
    let url="http://localhost:10083/follow/unFollow/"+id;
    let headers=this.auth.addHeaders();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.getFollowing();
    });
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
        this.auth.logoutService();
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
