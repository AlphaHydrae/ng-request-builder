import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
var RequestBuilder = (function () {
    function RequestBuilder(http) {
        this.http = http;
        this.requestOptions = new RequestOptions({
            headers: new Headers(),
            search: new URLSearchParams()
        });
    }
    Object.defineProperty(RequestBuilder.prototype, "options", {
        get: function () {
            return this.requestOptions;
        },
        enumerable: true,
        configurable: true
    });
    RequestBuilder.prototype.method = function (method) {
        this.requestOptions.method = method;
        return this;
    };
    RequestBuilder.prototype.url = function (url) {
        this.requestUrl = url.match(/^(https?\:\/\/|\/\/)/) ? url : '/api' + url;
        return this;
    };
    RequestBuilder.prototype.json = function (object) {
        this.requestOptions.body = JSON.stringify(object);
        this.requestOptions.headers.set('Content-Type', 'application/json');
        return this;
    };
    RequestBuilder.prototype.header = function (key, value) {
        this.requestOptions.headers.set(key, value);
        return this;
    };
    RequestBuilder.prototype.execute = function () {
        if (!this.requestUrl) {
            throw new Error('Request URL must be set');
        }
        return this.http.request(this.requestUrl, this.requestOptions);
    };
    return RequestBuilder;
}());
export { RequestBuilder };
