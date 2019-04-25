/**
 * name:http服务
 * describe:对http请求做统一处理
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


const CLIENT_URL = `${environment.oaApiHost}/`;
// const LAN_URL = 'http://api.zhst.site/'; // dev api url

const LAN_URL = environment.oaApiHost + '/'; // dev api url

const TOKEN_KEY = 'access_token'; // key name

const ERR_CODE = {
  400: '错误的请求。用户名或密码错误。',
  401: '未经授权。服务器拒绝响应。',
  403: '已禁止。服务器拒绝响应。',
  404: '未找到。无法找到请求的位置。',
  405: '方法不被允许。使用该位置不支持的请求方法进行了请求。',
  406: '不可接受。服务器只生成客户端不接受的响应。',
  407: '需要代理身份验证。客户端必须先使用代理对自身进行身份验证。',
  408: '请求超时。等待请求的服务器超时。',
  409: '冲突。由于请求中的冲突，无法完成该请求。',
  410: '过期。请求页不再可用。',
  411: '长度必需。未定义“内容长度”。',
  412: '前提条件不满足。请求中给定的前提条件由服务器评估为 false。',
  413: '请求实体太大。服务器不会接受请求，因为请求实体太大。',
  414: '请求 URI 太长。服务器不会接受该请求，因为 URL 太长。',
  415: '不支持的媒体类型。服务器不会接受该请求，因为媒体类型不受支持。',
  416: 'HTTP 状态代码 {0}',
  500: '内部服务器错误。',
  501: '未实现。服务器不识别该请求方法，或者服务器没有能力完成请求。',
  503: '服务不可用。服务器当前不可用(过载或故障)。'
};


@Injectable()
export class HttpService {
  clientUrl = CLIENT_URL;
  fileUploadUrl = null;
  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.fileUploadUrl = `${LAN_URL}/api/files?token=${this.readToken()}`;
  }

  /**
   * 统一发送请求
   * @param params
   * @returns {Promise<{success: boolean, msg: string}>|Promise<R>}
   */
  public request(params: any): any {
    // POST请求（参数、返回值类型都是任意类型）
    if (params['method'] === 'post' || params['method'] === 'POST') {
      return this.post(params['url'], params['data']);
    } else { // get 请求
      return this.get(params['url'], params['data']);
    }
  }


  /**
   * get请求
   * @param url 接口地址
   * @param params 参数
   * @returns {Promise<R>|Promise<U>}
   */

  public get(url: string, params?: any): any {
    let httpParams = new HttpParams();
    params = Object.assign({}, params);
    url = this.spliceApi(LAN_URL, url);

    params.token = this.readToken();

    Object.keys(params).forEach(element => {
      httpParams = httpParams.set(element, params[element]);
    });
    return this.http.get(url, {params: httpParams})
      .toPromise()
      .then(res => res)
      .catch(err => this.handleError(err));
  }

  public getD(url: string, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    params = Object.assign({}, params);
    url = this.spliceApi(LAN_URL, url);

    params.token = this.readToken();

    Object.keys(params).forEach(element => {
      httpParams = httpParams.set(element, params[element]);
    });

    return this.http.get(url, {params: httpParams}).pipe(
      catchError( (err: HttpErrorResponse) => {
        this.handleError(err);
        return of(err);
      })
    );
  }

  public get2(url: string, params?: any): any {
    let httpParams = '?';
    params = Object.assign({}, params);
    url = this.spliceApi(LAN_URL, url);

    params.token = this.readToken();

    Object.keys(params).forEach(element => {
      httpParams += element + '=' + params[element] + '&';
    });

    return url + httpParams;
  }


  /**
   * post请求
   * @param url 接口地址
   * @param body 参数
   * @returns {Promise<R>|Promise<U>}
   */
  public post(url: string, body?: any) {

    let params;
    url = this.spliceApi(LAN_URL, url);

    params = new HttpParams().set('token', this.readToken());

    return this.http.post(url, body, {params: params})
      .toPromise()
      .then((res: any) => res)
      .catch(err => this.handleError(err));
  }

  public postD(url: string, body: any, params?: any) {
    let httpParams = new HttpParams();
    params = Object.assign({}, params);
    url = this.spliceApi(LAN_URL, url);

    params.token = this.readToken();

    Object.keys(params).forEach(element => {
      httpParams = httpParams.set(element, params[element]);
    });

    return this.http.post(url, body, {params: httpParams}).pipe(
      catchError( (err: HttpErrorResponse) => {
        this.handleError(err);
        return of(err);
      })
    );
  }


  /**
   * patch请求
   * @param url 接口地址
   * @param body 参数
   * @returns {Promise<R>|Promise<U>}
   */
  public patch(url: string, body?: any) {

    let params;
    url = this.spliceApi(LAN_URL, url);

    params = new HttpParams().set('token', this.readToken());

    return this.http.patch(url, body, {params: params})
      .toPromise()
      .then((res: any) => res)
      .catch(err => this.handleError(err));
  }

  /**
   * put请求
   * @param url 接口地址
   * @param body 参数
   * @returns {Promise<R>|Promise<U>}
   */
  public put(url: string, body?: any) {

    let params;
    url = this.spliceApi(LAN_URL, url);

    params = new HttpParams().set('token', this.readToken());

    return this.http.put(url, body, {params: params})
      .toPromise()
      .then((res: any) => res)
      .catch(err => this.handleError(err));
  }

  public putD(url: string, body: any, params?: any) {
    let httpParams = new HttpParams();
    params = Object.assign({}, params);
    url = this.spliceApi(LAN_URL, url);

    params.token = this.readToken();

    Object.keys(params).forEach(element => {
      httpParams = httpParams.set(element, params[element]);
    });

    return this.http.put(url, body, {params: httpParams}).pipe(
      catchError( (err: HttpErrorResponse) => {
        this.handleError(err);
        return of(err);
      })
    );
  }

  /**
   * delete请求
   * @param url 接口地址
   * @param params 参数
   * @returns {Promise<R>|Promise<U>}
   */

  public delete(url: string, params?: any): any {
    let httpParams = new HttpParams();
    params = Object.assign({}, params);
    url = this.spliceApi(LAN_URL, url);

    params.token = this.readToken();

    Object.keys(params).forEach(element => {
      httpParams = httpParams.set(element, params[element]);
    });
    return this.http.delete(url, {params: httpParams})
      .toPromise()
      .then(res => res)
      .catch(err => this.handleError(err));
  }

  public deleteD(url: string, params?: any) {
    let httpParams = new HttpParams();
    params = Object.assign({}, params);
    url = this.spliceApi(LAN_URL, url);

    params.token = this.readToken();

    Object.keys(params).forEach(element => {
      httpParams = httpParams.set(element, params[element]);
    });

    return this.http.delete(url, {params: httpParams}).pipe(
      catchError( (err: HttpErrorResponse) => {
        this.handleError(err);
        return of(err);
      })
    );
  }

  /**
   * 页面下载请求
   * @param url 接口地址
   */
  public download(url: string, params?: any): void {
    let token;
    url = this.spliceApi(LAN_URL, url);

    token = this.readToken();

    window.location.href = `${url}?${params}&token=${token}`;
  }

  /**
   * Api 路径
   * @returns <string> token
   */
  spliceApi(comUrl, currentApi) {
    const firstChar = currentApi.charAt(1);
    if (firstChar === '/') {
      throw new Error(`${currentApi} 去掉 开头的 '/'`);
    }
    return (comUrl + currentApi);
  }

  readToken() {
    const user = JSON.parse(localStorage.getItem('_user')) || {'access_token': ''};
    return user[TOKEN_KEY] || false;
  }

  pushToken(params, token) {
    if (token !== null && token !== false) {
      params.set('token', token);
    }
    return params;
  }

  /**
   * 检查http状态码
   * @param response
   * @returns {response} || throw err message
   */
  checkStatus(response) {
    if (!response.status || response.status >= 200 && response <= 300) {
      alert('checkStatus, 1');
      return response;
    } else {
      alert('checkStatus, 2');
      throw {
        status: response.status,
        msg: response.msg,
        url: response.url
      };
    }
  }

  /**
   * 处理请求错误
   * @param error
   * @returns {void|Promise<string>|Promise<T>|any}
   */
  private handleError(error) {
    let msg = '';
    const status = error.status;
    if (ERR_CODE.hasOwnProperty(status)) {
      console.log(`HTTP-${status}错误:`, ERR_CODE[status]);
      msg = ERR_CODE[status];
      if (status === 401) {
        // window.location.href = `${CLIENT_URL}/login?returnUrl=${window.location.href}`;
        this.router.navigate(['/auth/login']);
      }
    } else {
      console.log(error);
      msg = '请求失败';
    }
    throw {
      status: error.status,
      msg: msg,
      url: error.url,
      error: error.error
    };
  }

  /**
   * 处理请求成功
   * @param res
   * @returns {{data: (string|null|((node:any)=>any)
 */

  private handleSuccess(res: Response | any) {
    // console.log('handleSuccess -> res: ', res);
    const body = res['_body'];
    // console.log("接口返回的成功信息：" + body)
    if (body) { // 有数据返回
      return {
        data: res || {}, // 返回内容
        code: res.code || {}, // 返回code
        message: res.message || {}, // 返回信息
        statusText: res.statusText || {},
        status: res.status || {},
        success: true
      };
    } else { // 无数据返回
      return {
        data: res.data || {}, // 返回内容
        code: res.code || {}, // 返回code
        message: res.message || {}, // 返回信息
        statusText: res.statusText || {},
        status: res.status || {},
        success: true
      };
    }
  }
}
