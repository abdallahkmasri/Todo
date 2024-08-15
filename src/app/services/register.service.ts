import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { enviroment } from "src/enviroments/enviroment";
import { IRegister } from "../models/register.model";

@Injectable({
    providedIn: 'root',
})

export class RegisterService {
    private _url = `${enviroment.url}/Users/register`;

    constructor(private http: HttpClient){}

    register(user: IRegister):Observable<any> {
        return this.http.post(this._url, user);
    }
}
