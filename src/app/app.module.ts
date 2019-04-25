import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import { HtmlPipe } from './@core/utils/html.pipe';

// 表单配置
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// 配置service
import { HttpService } from './@core/utils/http.service';
import { AuthService } from './auth/auth.service';

// 路由复用
import { AppRoutingModule, ComponentList } from './app-routing.module';
import { RouteReuseStrategy } from '@angular/router';
import { ReuseStrategy } from './@core/utils/reuse-strategy';

// 阿里zorro
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

// 自定义组件集
import { UploadFileComponent } from './@core/components/upload-file/upload-file.component';
import { UploadImageComponent } from './@core/components/upload-image/upload-image.component';
import { UploadAvatarComponent } from './@core/components/upload-avatar/upload-avatar.component';
import { PublicListComponent } from './@core/components/public-list/public-list.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    ...ComponentList,

    UploadFileComponent,
    UploadImageComponent,
    UploadAvatarComponent,
    PublicListComponent,
    HtmlPipe
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    AppRoutingModule,
    QuillModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    HttpService,
    AuthService,
    { provide: RouteReuseStrategy, useClass: ReuseStrategy }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    // 自定义组件集zoe
    UploadImageComponent,
    UploadFileComponent,
    UploadAvatarComponent,
    PublicListComponent
  ]
})
export class AppModule { }
