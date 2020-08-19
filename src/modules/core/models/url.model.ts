class Url {
  protocol: string;
  host: string;
  port: number;
  path: string;
  pathParams: object;
  queryParams: object;
  body: object;
}

export class UrlModel extends Url {

  constructor(url?: string) {
    super();

    this.protocol = 'http';
    this.host = '';
    this.port = null;
    this.path = '';
    this.pathParams = {};
    this.queryParams = {};
    this.body = {};

    if (url) {
      this.parseUrl(url);
    }

    return this;
  }


  // tslint:disable-next-line:variable-name
  private clearStartAndEndSlashes(string: string) {
    return string.replace(/(^\/+|\/+$)/g, '');
  }


  getProtocol() {
    return this.protocol;
  }
  setProtocol(protocol: string) {
    this.protocol = protocol.replace(/[^a-zA-Z]+/g, ''); // Keep only letters.
    return this;
  }


  getHost() {
    return this.host;
  }
  setHost(host: string) {
    this.host = this.clearStartAndEndSlashes(host);
    return this;
  }


  getPort() {
    return this.port;
  }
  setPort(port: number) {
    this.port = port;
    return this;
  }


  getPath() {
    return this.path;
  }
  setPath(path: string) {
    this.path += (this.path ? '/' : '') + this.clearStartAndEndSlashes(path);
    return this;
  }

  getPathParams() {
    return this.pathParams;
  }
  setPathParams(params: object) {
    this.pathParams = params;
    return this;
  }


  getQueryParams() {
    return this.queryParams;
  }
  setQueryParams(queryParams: object) {
    this.queryParams = queryParams;
    return this;
  }


  getBody() {
    return this.body;
  }
  setBody(body: object) {
    this.body = body;
    return this;
  }


  buildUrl() {
    // Replace pathParams.
    Object.keys(this.pathParams).forEach(param => {
      this.path = this.path.replace(`:${param}`, this.pathParams[param]);
    });

    // Apply queryParams.
    let queryParams = '';
    queryParams = Object.keys(this.queryParams).filter(key => this.queryParams[key] !== undefined).map(key => key + '=' + this.queryParams[key]).join('&');
    queryParams = (queryParams ? '?' : '') + queryParams;

    return this.protocol + '://' + this.host + (this.port ? ':' + this.port : '') + '/' + this.path + queryParams;
  }


  parseUrl(url: string) {
    // tslint:disable-next-line:variable-name
    const _url = new URL(url);
    this.protocol = _url.protocol.replace(/[^a-zA-Z]+/g, ''); // Keep only letters.
    this.host = _url.hostname;
    // tslint:disable-next-line:radix
    this.port = parseInt(_url.port);
    this.path = decodeURI(this.clearStartAndEndSlashes(_url.pathname));
    // tslint:disable-next-line:max-line-length
    this.queryParams = (_url.search ? JSON.parse('{"' + _url.search.replace(/&/g, '","').replace(/=/g, '":"').replace('?', '') + '"}', (key, value) => key === '' ? value : decodeURIComponent(value)) : {});
  }

}
