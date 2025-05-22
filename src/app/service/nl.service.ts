import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export abstract class NlService {

    protected baseAPI: string = environment.apiUrl;

    constructor() {
    }

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