import { Injectable } from "@angular/core";
import { NlService } from "./nl.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DotaMatch } from "@app/model";

@Injectable({
    providedIn: 'root'
})
export class OmniscienceService extends NlService {

    constructor(private http: HttpClient) {
        super();
    }

    getOnGoingMatches(): Observable<DotaMatch[]> {
        return this.http.get<DotaMatch[]>(this.baseAPI + '/api/v1/omniscience/ongoing');
    }

}