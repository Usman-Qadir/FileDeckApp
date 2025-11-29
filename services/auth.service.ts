import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    
    baseUrl: string = "https://localhost:7121/api/auth";

    constructor(private http: HttpClient)
    {

    }
// Register User
registerUser(userObj:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/register`, userObj);
}

// Login User
loginUser(loginObj:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/login`, loginObj);
}  

}