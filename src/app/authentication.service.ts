import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }
  authenticate(email,password)
  {
    
      const headers = new HttpHeaders({Authorization : " Basic "+ btoa(email+':'+password)});
      // headers.append('Access-Control-Allow-Origin', 'localhost:4200')

      return this.http.get('http://localhost:10083/login/validateUser',{headers}).pipe(
          map (data => {
              sessionStorage.setItem('token',btoa(email+':'+password));
          }
      ));
  }
  logoutService()
  {
    sessionStorage.removeItem('token');
  }

  addHeaders(){
    const token=sessionStorage.getItem("token");
    const headers=new HttpHeaders({ Authorization: " Basic " + token });

    return headers;
  }
}
