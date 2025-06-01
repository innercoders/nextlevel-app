import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeroStatsRecordsResponse, HeroStatsRequest } from '@app/model';
import { NlService } from './nl.service';
@Injectable({
	providedIn: 'root'
})
export class DotaMetaService extends NlService {

	constructor(private http: HttpClient) { 
		super();
	}

	getHeroStats(request: HeroStatsRequest): Observable<any> {
		const params = this.buildHttpParams(request);

		return this.http.get<any>(`${this.baseAPI}/api/v1/dota-meta/hero-stats`, 
			{ params });
	}
	
	getCompleteMeta(request: HeroStatsRequest): Observable<any> {
		const params = this.buildHttpParams(request);

		return this.http.get<any>(`${this.baseAPI}/api/v1/dota-meta/complete-meta`, 
			{ params });
	}

	getSimpleHeroInfo(heroId: number, facetId?: number, daysAgo?: number, onlyLeagueGames?: boolean): Observable<any> {
		const params: any = { heroId };
		if (facetId !== undefined) params.facetId = facetId;
		if (daysAgo !== undefined) params.daysAgo = daysAgo;
		if (onlyLeagueGames !== undefined) params.onlyLeagueGames = onlyLeagueGames;

		const httpParams = this.buildHttpParams(params);
		return this.http.get<any>(`${this.baseAPI}/api/v1/dota-meta/simple-hero`, { params: httpParams });
	}

	getDetailedHeroInfo(heroId: number, facetId: number, daysAgo?: number, onlyLeagueGames?: boolean): Observable<any> {
		const params: any = { heroId, facetId };
		if (daysAgo !== undefined) params.daysAgo = daysAgo;
		if (onlyLeagueGames !== undefined) params.onlyLeagueGames = onlyLeagueGames;

		const httpParams = this.buildHttpParams(params);
		return this.http.get<any>(`${this.baseAPI}/api/v1/dota-meta/detailed-hero`, { params: httpParams });
	}
	
}
