import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BestHeroesRequest, BestHeroItemsResponse, HeroStatsRecordsResponse } from '@app/model';
import { NlService } from './nl.service';
import { HeroOverrallStatsRequest } from 'app/model/request/hero-overrall-stats.request';
import { HeroStatsRecordsRequest } from 'app/model/request/hero-stats-records.request';
import { HeroMatchupsRequest } from 'app/model/request/hero-matchups.request';
import { BestHeroItemsRequest } from 'app/model/request/best-hero-items.request';
@Injectable({
	providedIn: 'root'
})
export class DotaMetaService extends NlService {

	public heroRecordPositions: any[] = [];

	private readonly DEFAULT_DAYS = 14;
	private readonly DEFAULT_MIN_MATCHES = 10;

	constructor(private http: HttpClient) { 
		super();
	}

	getBestHeroes(bestHeroesRequest: BestHeroesRequest): Observable<any> {
        let params = this.buildHttpParams(bestHeroesRequest);
        return this.http.get<any[]>(`${this.baseAPI}/api/v1/dota-meta/best-heroes`, { params });
    }

	getHeroOverrallStats(heroOverrallStatsRequest: HeroOverrallStatsRequest): Observable<any> {
		if(!heroOverrallStatsRequest.days) {
			heroOverrallStatsRequest.days = this.DEFAULT_DAYS;
		}

		if(!heroOverrallStatsRequest.minMatches) {
			heroOverrallStatsRequest.minMatches = this.DEFAULT_MIN_MATCHES;
		}

        let params = this.buildHttpParams(heroOverrallStatsRequest);
        return this.http.get<any>(`${this.baseAPI}/api/v1/dota-meta/hero/${heroOverrallStatsRequest.heroId}/overall-stats`, { params });
    }

	getHeroStatsRecords(heroStatsRecordsRequest: HeroStatsRecordsRequest): Observable<HeroStatsRecordsResponse[]> {
		if(!heroStatsRecordsRequest.days) {
			heroStatsRecordsRequest.days = this.DEFAULT_DAYS;
		}

		if(!heroStatsRecordsRequest.minMatches) {
			heroStatsRecordsRequest.minMatches = this.DEFAULT_MIN_MATCHES;
		}
        let params = this.buildHttpParams(heroStatsRecordsRequest);
        return this.http.get<HeroStatsRecordsResponse[]>(`${this.baseAPI}/api/v1/dota-meta/hero-stats-records`, { params });
    }

	getHeroMatchups(heroMatchupsRequest: HeroMatchupsRequest): Observable<any> {
		if(!heroMatchupsRequest.days) {
			heroMatchupsRequest.days = this.DEFAULT_DAYS;
		}

		if(!heroMatchupsRequest.minMatches) {
			heroMatchupsRequest.minMatches = this.DEFAULT_MIN_MATCHES;
		}

        let params = this.buildHttpParams(heroMatchupsRequest);
        return this.http.get<any[]>(`${this.baseAPI}/api/v1/dota-meta/hero/${heroMatchupsRequest.heroId}/matchups`, { params });
    }

	getBestHeroItems(bestHeroItemsRequest: BestHeroItemsRequest): Observable<BestHeroItemsResponse> {
		if(!bestHeroItemsRequest.days) {
			bestHeroItemsRequest.days = this.DEFAULT_DAYS;
		}

		if(!bestHeroItemsRequest.minMatches) {
			bestHeroItemsRequest.minMatches = this.DEFAULT_MIN_MATCHES;
		}

        let params = this.buildHttpParams(bestHeroItemsRequest);
        return this.http.get<BestHeroItemsResponse>(`${this.baseAPI}/api/v1/dota-meta/hero/${bestHeroItemsRequest.heroId}/best-items`, { params });
    }
	
	
	
}
