import { Injectable } from "@angular/core";
import { NlService } from "./nl.service";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthLoginResponse } from "app/model/response/auth-login.response";
import { User } from "app/model/user";

@Injectable({
    providedIn: 'root'
})
export class UserService extends NlService {

    private readonly TOKEN_KEY = 'access_token';
    private readonly USER_KEY = 'current_user';
    accessToken: string | null = null;
    currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient) {
        super();
        this.loadUserFromStorage();
    }

    getCurrentUser() {
        return this.currentUser.getValue();
    }

    getAccessToken(): string | null {
        return this.accessToken;
    }

    checkAuth() {
        const isAuthenticated = this.accessToken !== null;
        return isAuthenticated;
    }

    private loadUserFromStorage() {
        const storedToken = localStorage.getItem(this.TOKEN_KEY);
        const storedUser = localStorage.getItem(this.USER_KEY);
        
        if (storedToken && storedUser) {
            this.accessToken = storedToken;
            this.currentUser.next(JSON.parse(storedUser));
        }
    }

    setCurrentUser(authLoginResponse: AuthLoginResponse) {
        this.accessToken = authLoginResponse.accessToken;
        this.currentUser.next(authLoginResponse.user);
    
        // Save to localStorage
        localStorage.setItem(this.TOKEN_KEY, authLoginResponse.accessToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(authLoginResponse.user));
    }

    login(email: string, password: string): Observable<AuthLoginResponse> {
        return this.http.post<AuthLoginResponse>(`${this.baseAPI}/api/v1/auth/login`, { email, password })
    }

    logout() {
        this.currentUser.next(null);
        this.accessToken = null;
        
        // Clear localStorage
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }
}