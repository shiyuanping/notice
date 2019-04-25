import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteguardService } from './auth/routeguard.service';


import { LoginComponent } from './auth/login/login.component';
import { PagesComponent } from './pages/pages.component';
import { TenderNoticeComponent } from './pages/tender-notice/tender-notice.component';
import { ChangeNoticeComponent } from './pages/change-notice/change-notice.component';
import { CandidateNoticeComponent } from './pages/candidate-notice/candidate-notice.component';
import { PreviewComponent } from './pages/preview/preview.component';


export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
    data: { title: '用户登录', module: '/auth/login' },
  },
  {
    path: 'preview',
    component: PreviewComponent,
  },
  {
    path: 'pages',
    component: PagesComponent,
    canActivate: [RouteguardService],
    children: [
      {
        path: 'index',
        component: TenderNoticeComponent,
        data: {title: '招标公告', module: '/pages/index' }
      },
      {
        path: 'change',
        component: ChangeNoticeComponent,
        data: {title: '变更公告', module: '/pages/change' }
      },
      {
        path: 'candidate',
        component: CandidateNoticeComponent,
        data: {title: '中标候选人公示', module: '/pages/candidate' }
      }
    ]
  },
  { path: '', redirectTo: '/pages/index', pathMatch: 'full' },
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouteguardService],

})

export class AppRoutingModule { }

export const ComponentList = [
  LoginComponent,
  PagesComponent,
  TenderNoticeComponent,
  ChangeNoticeComponent,
  CandidateNoticeComponent,
  PreviewComponent
];
