import { Injectable } from "@angular/core";
import { NlService } from "./nl.service";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { DotaLeague } from "@app/model";
import { map, catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class DotaLeagueService extends NlService {

    constructor(private http: HttpClient) {
        super();
    }

    getFeaturedLeagues(): Observable<DotaLeague[]> {
        return this.http.get<DotaLeague[]>(`${this.baseAPI}/api/v1/dota-leagues/featured`);
    }

    getLeagues(): Observable<DotaLeague[]> {
        return this.http.get<DotaLeague[]>(`${this.baseAPI}/api/v1/dota-leagues`);
    }

    getLeagueInfo(leagueId: number): Observable<DotaLeague | null> {
        // First try to find in the featured leagues
        return this.getFeaturedLeagues().pipe(
            map(leagues => {
                const league = leagues.find(l => l.leagueId === leagueId);
                if (league) {
                    return league;
                }
                
                // If not found, create a default league object
                return {
                    id: leagueId.toString(),
                    leagueId: leagueId,
                    name: 'Torneio',
                    displayName: `Torneio ID ${leagueId}`,
                    tier: null,
                    region: null
                };
            }),
            catchError(() => {
                // Return a default league if there's an error
                return of({
                    id: leagueId.toString(),
                    leagueId: leagueId,
                    name: 'Torneio',
                    displayName: `Torneio ID ${leagueId}`,
                    tier: null,
                    region: null
                });
            })
        );
    }

    createLeague(league: DotaLeague): Observable<DotaLeague> {
        return this.http.post<DotaLeague>(`${this.baseAPI}/api/v1/dota-leagues`, league);
    }

    updateLeague(league: DotaLeague): Observable<DotaLeague> {
        return this.http.patch<DotaLeague>(`${this.baseAPI}/api/v1/dota-leagues/${league.id}`, league);
    }
}