import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DotaMetaResponse } from '@app/model';
import { NlService } from './nl.service';

@Injectable({
	providedIn: 'root'
})
export class DotaRankService extends NlService {

	constructor(private http: HttpClient) { 
		super();
	}

	public getDotaRanksAmericas(): Observable<any[]> {
		return this.http.get<any[]>(this.baseAPI + '/api/v1/dota-rank/americas');
	}

	public getDotaRanksEurope(): Observable<any[]> {
		return this.http.get<any[]>(this.baseAPI + '/api/v1/dota-rank/europe');
	}

	public getDotaRanksSeAsia(): Observable<any[]> {
		return this.http.get<any[]>(this.baseAPI + '/api/v1/dota-rank/se_asia');
	}

	public getDotaRanksChina(): Observable<any[]> {
		return this.http.get<any[]>(this.baseAPI + '/api/v1/dota-rank/china');
	}
}
