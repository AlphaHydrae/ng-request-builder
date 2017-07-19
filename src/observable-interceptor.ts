import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

export interface ObservableInterceptor {
  onRequest(observable: Observable<Response>): void;
}

export type ObservableInterceptorFunc = (observable: Observable<Response>) => void;

export type ObservableInterceptorType = ObservableInterceptor | ObservableInterceptorFunc;

export function callObservableInterceptor(interceptor: ObservableInterceptorType, observable: Observable<Response>) {
  if (typeof(interceptor) === 'function') {
    interceptor(observable);
  } else {
    interceptor.onRequest(observable);
  }
}
