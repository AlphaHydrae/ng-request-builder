import { Headers, Http, Request, RequestMethod, RequestOptions, Response, ResponseContentType, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { callObservableInterceptor, ObservableInterceptorType } from './observable-interceptor';
import { mergeRequestOptions } from './utils';

/**
 * Chainable HTTP request builder.
 *
 * @example
 *
 * ```
 *
 * let res: Observable<Response> = new RequestBuilder(http)
 *   .post('http://example.com')   // Set the URL
 *   .body({ foo: 'bar' })         // POST a JSON body with Content-Type application/json
 *   .execute();                   // Execute the HTTP request
 *
 * let res2: Observable<Response> = new RequestBuilder(http)
 *   .get('http://example.com')
 *   .header('Authorization', 'Bearer secret')   // Set headers
 *   .search('page', 2)                          // Set search params
 *   .search('pageSize', 20)
 *   .execute();
 * ```
 */
export class RequestBuilder {

  /**
   * Angular's Http service, used to perform the HTTP request when `execute` is called.
   */
  private http: Http;
  /**
   * The RequestOptions with which the HTTP request will be performed when `execute` is called.
   */
  private requestOptions: RequestOptions;
   /**
    * Interceptors which will be called with the observable of each request triggered from this builder.
    */
  private observableInterceptors: ObservableInterceptorType[];

  /**
   * Constructs a new request builder.
   *
   * @param http Angular's Http service, used to perform the HTTP request when [[execute]] is called.
   * @param requestOptions Default options for requests.
   */
  constructor(http?: Http, options: RequestBuilderOptions = {}) {
    this.http = http;

    const baseRequestOptions = new RequestOptions({
      headers: new Headers(),
      search: new URLSearchParams()
    });

    this.requestOptions = mergeRequestOptions(baseRequestOptions, options.defaultRequestOptions);
    if (!this.requestOptions.method) {
      this.requestOptions.method = RequestMethod.Get;
    }

    this.observableInterceptors = options.observableInterceptors || [];
  }

  /**
   * Supplies this builder's internal RequestOptions object to the specified function for modification.
   *
   * This is provided so that request options can be freely modified if the provided chainable methods are not sufficient.
   *
   * @example
   * ```
   *
   * builder.modify((requestOptions: RequestOptions) => {
   *   requestOptions.method = RequestMethod.Post;
   *   requestOptions.body = JSON.stringify({ foo: 'bar' });
   *   requestOptions.headers = new Headers({
   *     'Content-Type': 'application/json'
   *   });
   * });
   * ```
   */
  public modify(func: (options: RequestOptions) => any) {
    if (func) {
      func(this.requestOptions);
    }

    return this;
  }

  public setOptions(options: RequestOptions): RequestBuilder {
    this.requestOptions = this.requestOptions.merge(options);
    return this;
  }

  /**
   * Sets the request's HTTP method (e.g. GET, POST).
   *
   * @example
   * ```
   *
   * builder.method('HEAD');
   * builder.method(RequestMethod.Patch);
   * ```
   */
  public method(method: string | RequestMethod): RequestBuilder {
    this.requestOptions.method = method;
    return this;
  }

  /**
   * Sets the request's URL.
   *
   * @example
   * ```
   *
   * builder.url('http://example.com/path');
   * ```
   */
  public url(url: string): RequestBuilder {
    this.requestOptions.url = url;
    return this;
  }

  /**
   * Sets the request's body (and optionally its content type).
   *
   * By default, the content type is `application/json` and the specified content is
   * serialized with `JSON.stringify`.
   *
   * @example
   * ```
   *
   * builder.body({ foo: 'bar' });
   * ```
   */
  public body(content: any, contentType?: string): RequestBuilder {
    if (!contentType || contentType.match(/^application\/json(;|$)/)) {
      this.requestOptions.body = JSON.stringify(content);
      this.requestOptions.headers.set('Content-Type', 'application/json');
    } else {
      throw new Error('Unsupported content type ' + contentType);
    }

    if (this.requestOptions.method === RequestMethod.Get) {
      this.requestOptions.method = RequestMethod.Post;
    }

    return this;
  }

  /**
   * Alias of [[setHeader]];
   */
  public header(name: string, value: string): RequestBuilder {
    return this.setHeader(name, value);
  }

  /**
   * Appends a value to the existing list of values for a header.
   *
   * @example
   * ```
   *
   * builder.header('Link', '<http://example.com/list?page=3&per_page=100>; rel="next"');
   * builder.header('Link', '<http://example.com/list?page=50&per_page=100>; rel="last"');
   * ```
   */
  public appendHeader(name: string, value: string): RequestBuilder {
    this.requestOptions.headers.append(name, value);
    return this;
  }

  /**
   * Deletes all header values for the specified name.
   *
   * @example
   * ```
   *
   * builder.deleteHeader('Authorization');
   * ```
   */
  public deleteHeader(name: string): RequestBuilder {
    this.requestOptions.headers.delete(name);
    return this;
  }

  /**
   * Sets or overrides the header value for the specified name.
   *
   * @example
   * ```
   *
   * builder.setHeader('Authorization', 'Bearer secret');
   * ```
   */
  public setHeader(name: string, value: string): RequestBuilder {
    this.requestOptions.headers.set(name, value);
    return this;
  }

  /**
   * Supplies this builder's internal Headers object to the specified function for modification.
   *
   * This is provided so that headers can be freely modified if the provided chainable methods are not sufficient.
   *
   * @example
   * ```
   *
   * builder.modifyHeaders((headers: Headers) => {
   *   if (!headers.has('Authorization')) {
   *     headers.set('Authorization', 'Bearer secret');
   *   }
   * });
   * ```
   */
  public modifyHeaders(func: (headers: Headers) => any) {
    if (func) {
      func(this.requestOptions.headers);
    }

    return this;
  }

  /**
   * Alias of [[setSearchParam]].
   */
  public search(param: string, value: string) {
    return this.setSearchParam(param, value);
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

  public interceptor(interceptor: ObservableInterceptorType): RequestBuilder {
    this.observableInterceptors.push(interceptor);
    return this;
  }

  /**
   * Executes the configured HTTP request.
   *
   * @param http The Http service with which to execute the request (defaults to the one supplied to the constructor).
   *
   * @example
   * ```
   *
   * builder.execute().subscribe((res) => {
   *   // handle the response
   * });
   * ```
   */
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

    const observable: Observable<Response> = http.request(this.requestOptions.url, this.requestOptions);

    // Call all registered observable interceptors
    if (this.observableInterceptors.length) {
      this.observableInterceptors.forEach(interceptor => callObservableInterceptor(interceptor, observable));
    }

    return observable;
  }
}

export interface RequestBuilderOptions {
  defaultRequestOptions?: RequestOptions;
  observableInterceptors?: ObservableInterceptorType[];
}
