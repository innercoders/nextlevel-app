import { Injectable } from "@angular/core";
import { NlService } from "./nl.service";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService extends NlService {

    currentUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient) {
        super();
    }

    getCurrentUser() {
        return this.currentUser.getValue();
    }

    setCurrentUser(user: any) {
        this.currentUser.next(user);
    }

    logout() {
        this.currentUser.next(null);
    }

}