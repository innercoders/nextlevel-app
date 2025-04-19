import { Injectable } from "@angular/core";
import { NlService } from "./nl.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthLoginResponse } from "app/model/response/auth-login.response";

@Injectable({
    providedIn: 'root'
})
export class AuthService extends NlService{

    constructor(private http: HttpClient) {
        super();
    }

    login(authLoginRequest: AuthLoginResponse): Observable<AuthLoginResponse> {
        return this.http.post<AuthLoginResponse>(this.baseAPI + '/api/v1/auth/login', authLoginRequest);
    }

    

}