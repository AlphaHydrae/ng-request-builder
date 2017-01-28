import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { RequestBuilder } from './';

@Injectable()
export class RequestBuilderService {

  constructor(private http: Http) {
  }

  public request(): RequestBuilder {
    return new RequestBuilder(this.http);
  }

}
