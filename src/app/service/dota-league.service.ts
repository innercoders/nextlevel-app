import { Injectable } from "@angular/core";
import { NlService } from "./nl.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DotaLeague } from "@app/model";

@Injectable({
    providedIn: 'root'
})
export class DotaLeagueService extends NlService {

    constructor(private http: HttpClient) {
        super();
    }

    getLeagues(): Observable<DotaLeague[]> {
        return this.http.get<DotaLeague[]>(`${this.baseAPI}/api/v1/dota-leagues`);
    }

    createLeague(league: DotaLeague): Observable<DotaLeague> {
        return this.http.post<DotaLeague>(`${this.baseAPI}/api/v1/dota-leagues`, league);
    }

    updateLeague(league: DotaLeague): Observable<DotaLeague> {
        return this.http.patch<DotaLeague>(`${this.baseAPI}/api/v1/dota-leagues/${league.id}`, league);
    }
}