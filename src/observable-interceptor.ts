import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

export interface ObservableInterceptor {
  onRequest(observable: Observable<Response>): Observable<Response>;
}

export type ObservableInterceptorFunc = (observable: Observable<Response>) => Observable<Response>;

export type ObservableInterceptorType = ObservableInterceptor | ObservableInterceptorFunc;

export function callObservableInterceptor(interceptor: ObservableInterceptorType, observable: Observable<Response>): Observable<Response> {
  if (typeof(interceptor) === 'function') {
    return interceptor(observable);
  } else {
    return interceptor.onRequest(observable);
  }
}
