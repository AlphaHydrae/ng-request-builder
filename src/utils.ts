import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

export function mergeRequestOptions(requestOptions: RequestOptions, requestOptionsToMerge: RequestOptions): RequestOptions {
  if (!requestOptionsToMerge) {
    return requestOptions;
  }

  const mergedRequestOptions = requestOptions.merge(requestOptionsToMerge);

  mergedRequestOptions.headers = requestOptions.headers || new Headers();
  if (requestOptionsToMerge.headers) {
    requestOptionsToMerge.headers.forEach((values: string[], name: string) => {
      values.forEach((value) => mergedRequestOptions.headers.append(name, value));
    });
  }

  mergedRequestOptions.search = requestOptions.search || new URLSearchParams();
  if (requestOptionsToMerge.search) {
    requestOptionsToMerge.search.paramsMap.forEach((values: string[], name: string) => {
      values.forEach((value) => mergedRequestOptions.search.append(name, value));
    });
  }

  return mergedRequestOptions;
}
