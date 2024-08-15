import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { enviroment } from "src/enviroments/enviroment";
import { ISignIn } from "../models/signin.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class SigninService {
    private _url = `${enviroment.url}/Users/login`;

    constructor(private http: HttpClient){}

    signin(user: ISignIn): Observable<any>{
        return this.http.post(this._url, user);
    }
}
