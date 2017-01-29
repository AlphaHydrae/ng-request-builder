import { Headers, Http, Request, RequestMethod, RequestOptions, Response, ResponseContentType, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class RequestBuilder {

  private http: Http;
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

    if (!this.requestOptions.method) {
      this.requestOptions.method = RequestMethod.Get;
    }
  }

  get options(): RequestOptions {
    return this.requestOptions;
  }

  public method(method: string | RequestMethod): RequestBuilder {
    this.requestOptions.method = method;
    return this;
  }

  public url(url: string): RequestBuilder {
    this.requestOptions.url = url;
    return this;
  }

  public body(object: any, contentType?: string): RequestBuilder {
    if (!contentType || contentType.match(/^application\/json(;|$)/)) {
      this.requestOptions.body = JSON.stringify(object);
      this.requestOptions.headers.set('Content-Type', 'application/json');
    } else {
      throw new Error('Unsupported content type ' + contentType);
    }

    if (this.requestOptions.method === RequestMethod.Get) {
      this.requestOptions.method = RequestMethod.Post;
    }

    return this;
  }

  public appendHeader(key: string, value: string): RequestBuilder {
    this.requestOptions.headers.append(key, value);
    return this;
  }

  public deleteHeader(key: string): RequestBuilder {
    this.requestOptions.headers.delete(key);
    return this;
  }

  public setHeader(key: string, value: string): RequestBuilder {
    this.requestOptions.headers.set(key, value);
    return this;
  }

  public modifyHeaders(func: (headers: Headers) => any) {
    if (func) {
      func(this.requestOptions.headers);
    }

    return this;
  }

  public appendSearchParam(param: string, value: string) {
    this.requestOptions.search.append(param, value);
    return this;
  }

  public appendAllSearchParams(params: URLSearchParams) {
    this.requestOptions.search.appendAll(params);
    return this;
  }

  public deleteSearchParam(param: string) {
    this.requestOptions.search.delete(param);
    return this;
  }

  public replaceAllSearchParams(params: URLSearchParams) {
    this.requestOptions.search.replaceAll(params);
    return this;
  }

  public setSearchParam(param: string, value: string) {
    this.requestOptions.search.set(param, value);
    return this;
  }

  public setAllSearchParams(params: URLSearchParams) {
    this.requestOptions.search.setAll(params);
    return this;
  }

  public setWithCredentials(withCredentials: boolean) {
    this.requestOptions.withCredentials = withCredentials;
    return this;
  }

  public setResponseType(responseType: ResponseContentType) {
    this.requestOptions.responseType = responseType;
    return this;
  }

  public execute(http?: Http): Observable<Response> {
    if (!http) {
      if (!this.http) {
        throw new Error('Http service must be provided at construction or execution');
      }

      http = this.http;
    }

    if (!this.requestOptions.url) {
      throw new Error('An URL must be set');
    }

    return http.request(this.requestOptions.url, this.requestOptions);
  }
}
