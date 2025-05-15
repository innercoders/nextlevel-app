import { Injectable } from "@angular/core";
import { NlService } from "./nl.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { BestHeroesRequest, DotaMatch } from "@app/model";

interface MatchesResponse {
    data: DotaMatch[];
    total: number;
}

interface ParseBatchResponse {
    success: boolean;
    message: string;
    results: any[];
}

@Injectable({
    providedIn: 'root'
})
export class DotaMatchService extends NlService {

    DEFAULT_DAYS_AGO = 14;

    constructor(private http: HttpClient) {
        super();
    }

    getLastMatches(count: number = 10): Observable<DotaMatch[]> {
        return this.http.get<DotaMatch[]>(`${this.baseAPI}/api/v1/dota-matches/last/${count}`);
    }

    getStats(): Observable<any> {
        return this.http.get<any>(`${this.baseAPI}/api/v1/dota-matches/stats`);
    }

    getMatchesByStatus(status: string, page: number = 1, limit: number = 10): Observable<MatchesResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());
        
        const endpoint = status 
            ? `${this.baseAPI}/api/v1/dota-matches/status/${status}`
            : `${this.baseAPI}/api/v1/dota-matches`;
            
        return this.http.get<MatchesResponse>(endpoint, { params });
    }

    parseBatchMatches(matchIds: string[]): Observable<ParseBatchResponse> {
        return this.http.post<ParseBatchResponse>(`${this.baseAPI}/api/v1/dota-matches/parse-batch`, { matchIds });
    }
}