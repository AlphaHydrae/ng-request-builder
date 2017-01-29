import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class RequestBuilder {

  private http: Http;
  private requestUrl: string;
  private requestOptions: RequestOptions;

  constructor(http?: Http, requestOptions?: RequestOptions) {
    this.http = http;

    if (requestOptions) {
      this.requestOptions = requestOptions;
    } else {
      this.requestOptions = new RequestOptions({
        headers: new Headers(),
        search: new URLSearchParams()
      });
    }
  }

  get options(): RequestOptions {
    return this.requestOptions;
  }

  public method(method: string): RequestBuilder {
    this.requestOptions.method = method;
    return this;
  }

  public url(url: string): RequestBuilder {
    this.requestUrl = url.match(/^(https?\:\/\/|\/\/)/) ? url : '/api' + url;
    return this;
  }

  public json(object: any): RequestBuilder {
    this.requestOptions.body = JSON.stringify(object);
    this.requestOptions.headers.set('Content-Type', 'application/json');
    return this;
  }

  public header(key: string, value: string): RequestBuilder {
    this.requestOptions.headers.set(key, value);
    return this;
  }

  public execute(http?: Http): Observable<Response> {
    if (!this.requestUrl) {
      throw new Error('Request URL must be set');
    }

    if (!http) {
      if (!this.http) {
        throw new Error('Http service must be provided at construction or execution');
      }

      http = this.http;
    }

    return http.request(this.requestUrl, this.requestOptions);
  }
}
