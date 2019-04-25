import { Injectable } from '@angular/core';
import { HttpService } from '../@core/utils/http.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()

export class AuthService {
  constructor(private http: HttpClient, private httpService: HttpService) {}

  register(body: any): Observable<Object> {
    return this.http.post(`${environment.oaApiHost}/api/v1/accounts/register`, body);
  }

  login(body: any): Observable<any> {
    // window.location.href = `${CLIENT_URL}/login?returnUrl=${window.location.href}`;
    return this.http.get(`${environment.oaApiHost}/api/v1/accounts/login`, {
        observe: 'body',
        params: new HttpParams().set('account', body.account).set('password', body.password)
    });
  }

  logout() {
    // this.token = null;
    // window.location.href = `${CLIENT_URL}/logout?returnUrl=${window.location.href}`;
    // console.log(this.token);
    return this.http.delete(`${environment.oaApiHost}/api/v1/accounts/logout`, {
        observe: 'body',
        params: new HttpParams().set('token', this.token),
    });
  }

  // 忘记密码 - 获取邮箱验证码
  getCode(account: string): Observable<Object> {
      return this.http.get(`${environment.oaApiHost}/api/v1/accounts/send-forget-email?account=${account}`);
  }

  resetPassword(body: any): Observable<Object> {
    return this.http.put(`${environment.oaApiHost}/api/v1/accounts/reset-password`, body);
  }

  set token(token: string) {
    if (!token) {
      localStorage.removeItem('_user');
    } else {
      const user = {
        access_token: token
      };
      localStorage.setItem('_user', JSON.stringify(user));
    }
  }

  get token() {
    const user = JSON.parse(localStorage.getItem('_user')) || {'access_token': ''};
    return user['access_token'] || false;
  }

  // 获取用户信息
  getUser() {
    return new Promise((resolve, reject) => {
      this.httpService.get(`api/v1/accounts`)
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }
  // 获取菜单详情
  getMenu(id) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`api/v1/menus/${id}`)
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }
  // 修改自身密码
  updatePassword(item) {
    return new Promise((resolve, reject) => {
      this.httpService.put(`api/v1/accounts/password`, item)
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }
}
