/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />
import { By } from '@angular/platform-browser';
import { DebugElement, ReflectiveInjector } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ConnectionBackend, Headers, Http, RequestOptions, BaseRequestOptions, Request, RequestMethod, Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import * as chai from 'chai';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Rx';
import URI from 'urijs';

import 'rxjs/add/operator/do';

import './imports.spec';
import { ObservableInterceptor } from '../src/observable-interceptor';
import { RequestBuilder, RequestBuilderOptions } from '../src/request-builder';

const expect = chai.expect;

describe('RequestBuilder', () => {

  let checkedRequests, http, lastConnection, lastRequest, requests, sampleBody;

  beforeEach(() => {

    requests = [];
    lastRequest = null;
    checkedRequests = 0;
    sampleBody = { foo: 'bar' };

    let injector = ReflectiveInjector.resolveAndCreate([
      { provide: ConnectionBackend, useClass: MockBackend },
      { provide: RequestOptions, useClass: BaseRequestOptions },
      Http
    ]);

    http = injector.get(Http);

    const backend = injector.get(ConnectionBackend) as MockBackend;
    backend.connections.subscribe((connection: any) => {
      lastConnection = connection;
      lastRequest = connection ? connection.request : null
      if (lastRequest) {
        requests.push(lastRequest);
      }
    });
  });

  it('should perform a GET request by default', () => {
    newBuilder().url('http://example.com/path').execute();
    expectRequest(RequestMethod.Get, 'http://example.com/path')
  });

  it('should perform a simple HEAD request', () => {
    newBuilder().url('http://example.com/path').method('HEAD').execute();
    expectRequest(RequestMethod.Head, 'http://example.com/path');
  });

  it('should perform a simple DELETE request', () => {
    newBuilder().url('http://example.com/path').method('DELETE').execute();
    expectRequest(RequestMethod.Delete, 'http://example.com/path');
  });

  it('should perform a simple GET request', () => {
    newBuilder().url('http://example.com/path').method('GET').execute();
    expectRequest(RequestMethod.Get, 'http://example.com/path');
  });

  it('should perform a simple OPTIONS request', () => {
    newBuilder().url('http://example.com/path').method('OPTIONS').execute();
    expectRequest(RequestMethod.Options, 'http://example.com/path');
  });

  it('should perform a simple PATCH request', () => {
    newBuilder().url('http://example.com/path').method('PATCH').body(sampleBody).execute();
    expectRequest(RequestMethod.Patch, 'http://example.com/path', JSON.stringify(sampleBody), { 'Content-Type': 'application/json' });
  });

  it('should perform a simple POST request', () => {
    newBuilder().url('http://example.com/path').body(sampleBody).execute();
    expectRequest(RequestMethod.Post, 'http://example.com/path', JSON.stringify(sampleBody), { 'Content-Type': 'application/json' });
  });

  it('should perform a simple PUT request', () => {
    newBuilder().url('http://example.com/path').method('PUT').body(sampleBody).execute();
    expectRequest(RequestMethod.Put, 'http://example.com/path', JSON.stringify(sampleBody), { 'Content-Type': 'application/json' });
  });

  it('should copy the request options provided at construction', () => {

    const defaultRequestOptions = new RequestOptions({
      headers: new Headers({ Foo: 'Bar' }),
      search: new URLSearchParams()
    });

    defaultRequestOptions.search.set('fooo', 'baar');

    const builderOptions = {
      defaultRequestOptions: defaultRequestOptions
    };

    newBuilder(builderOptions).url('http://example.com/path').header('Baz', 'Qux').search('baaz', 'quux').execute();
    expectRequestAt(0, RequestMethod.Get, 'http://example.com/path', null, { Foo: 'Bar', Baz: 'Qux' }, { fooo: 'baar', baaz: 'quux' });

    newBuilder(builderOptions).url('http://example.com/path').header('Corge', 'Grault').search('coorge', 'graault').execute();
    expectRequestAt(1, RequestMethod.Get, 'http://example.com/path', null, { Foo: 'Bar', Corge: 'Grault' }, { fooo: 'baar', coorge: 'graault' });

    expectNoMoreRequests();
  });

  it('should call registered observable interceptors', fakeAsync(() => {

    const interceptorsCalled = [];
    const interceptorsResponses = [];

    const interceptor1: ObservableInterceptor = {
      onRequest(observable: Observable<Response>) {
        interceptorsCalled.push(1);
        return observable.do(response => interceptorsResponses.push(response.json()));
      }
    };

    const interceptor2 = (observable: Observable<Response>) => {
      interceptorsCalled.push(2);
      return observable.do(response => interceptorsResponses.push(response.json()));
    };

    const interceptor3 = (observable: Observable<Response>) => {
      interceptorsCalled.push(3);
      return observable.do(response => interceptorsResponses.push(response.json()));
    };

    const builderOptions = {
      observableInterceptors: [ interceptor1, interceptor2 ]
    };

    const observable = newBuilder(builderOptions).url('http://example.com/path').interceptor(interceptor3).execute();
    expectRequest(RequestMethod.Get, 'http://example.com/path')

    expect(interceptorsCalled).to.eql([ 1, 2, 3 ]);
    expect(interceptorsResponses).to.be.empty;

    observable.subscribe(response => {
      expect(response.json()).to.eql({ foo: 'bar' });
    });

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({ foo: 'bar' })
    })));

    tick();

    expect(interceptorsResponses).to.eql([
      { foo: 'bar' },
      { foo: 'bar' },
      { foo: 'bar' }
    ]);
  }));

  it('should throw an error if the Http service is not given at construction or execution', () => {
    expect(() => new RequestBuilder().url('http://example.com/path').execute()).to.throw('Http service must be provided at construction or execution');
  });

  it('should throw an error if no URL is given', () => {
    expect(() => newBuilder().execute()).to.throw('An URL must be set');
  });

  function newBuilder(builderOptions?: RequestBuilderOptions) {
    return new RequestBuilder(http, builderOptions);
  }

  function expectRequest(method: RequestMethod, url: string, body?: any, headers?: { [s: string]: string | Array<string> }, search?: { [s: string]: string | Array<string> }) {
    expectRequestAt(0, method, url, body, headers, search);
    expect(requests).to.have.lengthOf(1);
  }

  function expectRequestAt(position: number, method: RequestMethod, url: string, body?: any, headers?: { [s: string]: string | Array<string> }, search?: { [s: string]: string | Array<string> }) {

    const request = requests[position];
    expect(request).to.be.an.instanceof(Request);
    expect(request.method).to.equal(method);

    const uri = new URI(request.url);
    const expectedUri = new URI(url);
    expect(uri.clone().query('').toString()).to.eq(expectedUri.toString());

    if (body) {
      expect(request.getBody()).to.equal(body);
    } else {
      expect(request.getBody()).to.equal(null);
    }

    if (!headers) {
      expect(request.headers.keys()).to.be.empty;
    } else {
      expect(request.headers.toJSON()).to.eql(normalizeParamsMap(headers));
    }

    if (!search) {
      expect(request.search).to.equal(undefined);
    } else {
      const actualParams = request.search ? request.search.paramsMap : normalizeParamsMap(uri.search(true));
      expect(actualParams).to.eql(normalizeParamsMap(search));
    }

    checkedRequests++;
  }

  function expectNoMoreRequests() {
    expect(requests).to.have.lengthOf(checkedRequests);
  }

  function normalizeParamsMap(map: { [key:string]: string | string[] }): { [key:string]: string[] } {
    return _.mapValues(map, values => _.isArray(values) ? values : [ values ])
  }
});
