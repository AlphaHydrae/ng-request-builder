import { Injectable } from '@angular/core';
import { Http, RequestMethod, RequestOptions } from '@angular/http';

import { RequestBuilder } from './request-builder';

/**
 * An Angular service to easily create [[RequestBuilder]] objects.
 *
 * @example
 *
 *     import { Injectable } from '@angular/core';
 *     import { RequestBuilderService } from 'ng-request-builder';
 *
 *     @Injectable()
 *     export class MyService {
 *
 *       constructor(private requestBuilderService: RequestBuilderService) {
 *       }
 *
 *       public doStuff(): Observable<Response> {
 *         return this.requestBuilderService
 *           .get('http://example.com')
 *           .header('Authorization', 'Bearer secret')
 *           .search('offset', 25)
 *           .search('limit', 50)
 *           .execute()
 *       }
 *
 *     }
 */
@Injectable()
export class RequestBuilderService {

  /**
   * Constructs the request builder service.
   *
   * @param http Angular's Http service, used to execute HTTP requests.
   * @param defaultsOptions Default options to apply to all requests.
   */
  constructor(private http: Http, private defaultOptions: RequestOptions) {
  }

  /**
   * Returns a [[RequestBuilder]] configured to perform a GET request to the specified URL.
   *
   * @example
   * ```
   *
   * requestBuilderService.get('http://example.com/path');
   * ```
   */
  public request(url: string): RequestBuilder {
    return new RequestBuilder(this.http, this.defaultOptions).method(RequestMethod.Get).url(url);
  }

  /**
   * Returns a [[RequestBuilder]] configured to perform a DELETE request to the specified URL.
   *
   * @example
   * ```
   *
   * requestBuilderService.delete('http://example.com/path');
   * ```
   */
  public delete(url: string): RequestBuilder {
    return this.request(url).method(RequestMethod.Delete);
  }

  /**
   * Returns a [[RequestBuilder]] configured to perform a GET request to the specified URL.
   *
   * @example
   * ```
   *
   * requestBuilderService.get('http://example.com/path');
   * ```
   */
  public get(url: string): RequestBuilder {
    return this.request(url).method(RequestMethod.Get);
  }

  /**
   * Returns a [[RequestBuilder]] configured to perform a HEAD request to the specified URL.
   *
   * @example
   * ```
   *
   * requestBuilderService.head('http://example.com/path');
   * ```
   */
  public head(url: string): RequestBuilder {
    return this.request(url).method(RequestMethod.Head);
  }

  /**
   * Returns a [[RequestBuilder]] configured to perform a OPTIONS request to the specified URL.
   *
   * @example
   * ```
   *
   * requestBuilderService.options('http://example.com/path');
   * ```
   */
  public options(url: string): RequestBuilder {
    return this.request(url).method(RequestMethod.Options);
  }

  /**
   * Returns a [[RequestBuilder]] configured to perform a PATCH request to the specified URL.
   *
   * @example
   * ```
   *
   * requestBuilderService.patch('http://example.com/path'); // without a body
   * requestBuilderService.patch('http://example.com/path', { foo: 'bar' }); // with a body
   * ```
   */
  public patch(url: string, body?: any, contentType?: string): RequestBuilder {
    let builder = this.request(url).method(RequestMethod.Patch);
    if (body) {
      builder = builder.body(body, contentType);
    }
    return builder;
  }

  /**
   * Returns a [[RequestBuilder]] configured to perform a POST request to the specified URL.
   *
   * @example
   * ```
   *
   * requestBuilderService.post('http://example.com/path'); // without a body
   * requestBuilderService.post('http://example.com/path', { foo: 'bar' }); // with a body
   * ```
   */
  public post(url: string, body?: any, contentType?: string): RequestBuilder {
    let builder = this.request(url).method(RequestMethod.Post);
    if (body) {
      builder = builder.body(body, contentType);
    }
    return builder;
  }

  /**
   * Returns a [[RequestBuilder]] configured to perform a PUT request to the specified URL.
   *
   * @example
   * ```
   *
   * requestBuilderService.put('http://example.com/path'); // without a body
   * requestBuilderService.put('http://example.com/path', { foo: 'bar' }); // with a body
   * ```
   */
  public put(url: string, body?: any, contentType?: string): RequestBuilder {
    let builder = this.request(url).method(RequestMethod.Put);
    if (body) {
      builder = builder.body(body, contentType);
    }
    return builder;
  }

}
