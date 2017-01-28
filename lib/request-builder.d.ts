import { Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
export declare class RequestBuilder {
    private http;
    private requestUrl;
    private requestOptions;
    constructor(http: Http);
    readonly options: RequestOptions;
    method(method: string): RequestBuilder;
    url(url: string): RequestBuilder;
    json(object: any): RequestBuilder;
    header(key: string, value: string): RequestBuilder;
    execute(): Observable<Response>;
}
