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

	getHeroStats(request: HeroStatsRequest): Observable<HeroStatsRecordsResponse> {
		const params = this.buildHttpParams(request);

		return this.http.get<HeroStatsRecordsResponse>(`${this.baseAPI}/api/v1/dota-meta/hero-stats`, 
			{ params });
	}
	
}
