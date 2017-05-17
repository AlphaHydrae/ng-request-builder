# Angular Request Builder

[![npm version](https://badge.fury.io/js/ng-request-builder.svg)](https://badge.fury.io/js/ng-request-builder)
[![Dependency Status](https://gemnasium.com/badges/github.com/AlphaHydrae/ng-request-builder.svg)](https://gemnasium.com/github.com/AlphaHydrae/ng-request-builder)
[![Build Status](https://travis-ci.org/AlphaHydrae/ng-request-builder.svg?branch=master)](https://travis-ci.org/AlphaHydrae/ng-request-builder)

> A chainable HTTP request builder for Angular.

```ts
import { Injectable } from '@angular/core';
import { RequestBuilderService } from 'ng-request-builder';

@Injectable()
export class MyService {

  constructor(private requestBuilderService: RequestBuilderService) {
  }

  public doStuff() {
    this.requestBuilderService
      .request('http://example.com')
      .setHeader('Authorization', 'Bearer secret')
      .setSearchParam('offset', 25)
      .setSearchParam('limit', 50)
      .execute()
      .subscribe((res) => {
        // Do stuff with res
      });
  }

}
```





<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Requirements](#requirements)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->





## Requirements

* Angular 2+
* RxJS 5+
* Zone.js 0.7+





## Usage

Import it into your module:

```ts
import { NgModule } from '@angular/core';
import { RequestBuilderModule } from 'ng-request-builder';

import { MyService } from './my.service.ts';

@NgModule({
  imports: [
    RequestBuilderModule
  ],
  providers: [
    MyService
  ]
})
export class MyModule { }
```

Inject the `RequestBuilderService` service:

```ts
import { Injectable } from '@angular/core';
import { RequestBuilderService } from 'ng-request-builder';

@Injectable()
export class MyService {

  constructor(private RequestBuilderService requestBuilderService) {
  }

  public doStuff() {
    this.requestBuilderService
      .request('http://example.com')
      .setHeader('Authorization', 'Bearer secret')
      .setSearchParam('offset', 25)
      .setSearchParam('limit', 50)
      .execute()
      .subscribe((res) => {
        // Do stuff with res
      });
  }

}
```
