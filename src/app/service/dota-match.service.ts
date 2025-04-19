import { Injectable } from "@angular/core";
import { NlService } from "./nl.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { BestHeroesRequest, DotaMatch } from "@app/model";

@Injectable({
    providedIn: 'root'
})
export class DotaMatchService extends NlService {

    constructor(private http: HttpClient) {
        super();
    }

    getLastMatches(count: number = 10): Observable<DotaMatch[]> {
        return this.http.get<DotaMatch[]>(`${this.baseAPI}/api/v1/dota-matches/last/${count}`);
    }

}