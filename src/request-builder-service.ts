import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import { RequestBuilder } from './request-builder';

@Injectable()
export class RequestBuilderService {

  constructor(private http: Http, private defaultOptions: RequestOptions) {
  }

  public request(): RequestBuilder {
    return new RequestBuilder(this.http);
  }

}
