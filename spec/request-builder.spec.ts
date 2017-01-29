/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />
import { By } from '@angular/platform-browser';
import { DebugElement, ReflectiveInjector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectionBackend, Http, RequestOptions, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import * as chai from 'chai';

import { RequestBuilder } from '../src/ng-request-builder';

const expect = chai.expect;

describe('RequestBuilder', () => {
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
      Http
    ]);

    this.http = this.injector.get(Http);
    this.backend = this.injector.get(ConnectionBackend) as MockBackend;
    this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
  });

  it('should work', () => {
    const builder = new RequestBuilder(this.http);
    expect(builder.method('GET')).to.equal(builder);
  });
});
