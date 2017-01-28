import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class RequestBuilder {

  private http: Http;
  private requestUrl: string;
  private requestOptions: RequestOptions;

  constructor(http: Http) {
    this.http = http;
    this.requestOptions = new RequestOptions({
      headers: new Headers(),
      search: new URLSearchParams()
    });
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

  public execute(): Observable<Response> {
    if (!this.requestUrl) {
      throw new Error('Request URL must be set');
    }

    return this.http.request(this.requestUrl, this.requestOptions);
  }
}
