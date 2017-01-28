import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as chai from 'chai';

import { RequestBuilder } from '../src/request-builder';

const expect = chai.expect;

describe('Hello', () => {
  it('should display original title', () => {
    const builder = new RequestBuilder();
    expect(builder.method('GET')).to.equal(builder);
  });
});
