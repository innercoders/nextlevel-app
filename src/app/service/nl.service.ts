import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export abstract class NlService {

    protected baseAPI: string = 'http://localhost:3000';

    constructor() { }

    protected buildHttpParams(requestObject: any): HttpParams {
        let params = new HttpParams();
    
        Object.entries(requestObject).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params = params.set(key, value.toString());
            }
        });
    
        return params;
    }

}