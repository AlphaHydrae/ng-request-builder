/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />
import { By } from '@angular/platform-browser';
import { DebugElement, ReflectiveInjector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectionBackend, Http, RequestOptions, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import * as chai from 'chai';

import { RequestBuilder, RequestBuilderService } from '../src/ng-request-builder';

const expect = chai.expect;

describe('RequestBuilderService', () => {
  beforeEach(() => {
    this.injector = ReflectiveInjector.resolveAndCreate([
      {
        provide: ConnectionBackend,
        useClass: MockBackend
      },
      {
        provide: RequestOptions,
        useClass: BaseRequestOptions
      },
      Http,
      RequestBuilderService
    ]);

    this.requestBuilderService = this.injector.get(RequestBuilderService);
    this.backend = this.injector.get(ConnectionBackend) as MockBackend;
    this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
  });

  it('should work', () => {
    expect(this.requestBuilderService).not.to.equal(null);
  });
});
