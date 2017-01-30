/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />
import { By } from '@angular/platform-browser';
import { DebugElement, ReflectiveInjector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectionBackend, Http, RequestOptions, BaseRequestOptions, Request, RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import * as chai from 'chai';
import * as _ from 'lodash';

import { RequestBuilder } from '../src/request-builder';

const expect = chai.expect;

describe('RequestBuilder', () => {

  let connectionsCount, http, lastRequest, sampleBody;

  beforeEach(() => {

    lastRequest = null;
    connectionsCount = 0;
    sampleBody = { foo: 'bar' };

    let injector = ReflectiveInjector.resolveAndCreate([
      { provide: ConnectionBackend, useClass: MockBackend },
      { provide: RequestOptions, useClass: BaseRequestOptions },
      Http
    ]);

    http = injector.get(Http);

    let backend = injector.get(ConnectionBackend) as MockBackend;
    backend.connections.subscribe((connection: any) => {
      connectionsCount++;
      lastRequest = connection ? connection.request : null
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

  it('should throw an error if the Http service is not given at construction or execution', () => {
    expect(() => new RequestBuilder().url('http://example.com/path').execute()).to.throw('Http service must be provided at construction or execution');
  });

  it('should throw an error if no URL is given', () => {
    expect(() => newBuilder().execute()).to.throw('An URL must be set');
  });

  function newBuilder() {
    return new RequestBuilder(http);
  }

  function expectRequest(method: RequestMethod, url: string, body?: any, headers?: { [s: string]: string | Array<string> }, search?: { [s: string]: string | Array<string> }) {
    expect(lastRequest).to.be.an.instanceof(Request);
    expect(lastRequest.method).to.equal(method);

    if (body) {
      expect(lastRequest.getBody()).to.equal(body);
    } else {
      expect(lastRequest.getBody()).to.equal(null);
    }

    if (!headers) {
      expect(lastRequest.headers.keys()).to.be.empty;
    } else {
      expect(lastRequest.headers.toJSON()).to.eql(_.mapValues(headers, (values) => _.isArray(values) ? values : [ values ]));
    }

    if (!search) {
      expect(lastRequest.search).to.equal(undefined);
    } else {
      expect(lastRequest.search.paramsMap).to.eql(_.mapValues(search, (values) => _.isArray(values) ? values : [ values ]));
    }

    expect(connectionsCount).to.equal(1);
  }
});
