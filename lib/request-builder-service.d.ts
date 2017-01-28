import { Http } from '@angular/http';
import { RequestBuilder } from './';
export declare class RequestBuilderService {
    private http;
    constructor(http: Http);
    request(): RequestBuilder;
}
