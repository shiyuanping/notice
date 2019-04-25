import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { ReuseStrategy } from '../@core/utils/reuse-strategy';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MENU_DATA } from './menu-data';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpService } from '../@core/utils/http.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
  providers: [AuthService]
})
export class PagesComponent implements OnInit {
  // 样式
  style: any;
  theme = 'dark';
  messageNumb = 0;

  menuList: Array<{ title: string, module: string, isSelect: boolean}> = [];

  index = 0;
  isCollapsed = false;
  triggerTemplate = null;

  avatar: string;
  name: string;

  updatePassword = false;
  updatePasswordForm: FormGroup;
  @ViewChild('trigger') customTrigger: TemplateRef<void>;
  leftMenuList = MENU_DATA;
  // leftMenuList = [];
  openHandler(value: string): void {
    this.leftMenuList.forEach(menu => {
      if (menu.name !== value) {
        menu.sub = false;
      }
    });
  }
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }
  constructor
  (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private authService: AuthService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private http: HttpService,
  ) {
    const token = this.http.readToken();

    this.setSkin('ink');
    // 路由事件
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route !== null && route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe((event) => {
      // 路由data的标题
      const title = event['title'];
      const menu = { title: title, module: event['module'], isSelect: true};
      this.menuList.forEach(u => u.isSelect = false);
      // this.titleService.setTitle(title);
      const existMenu =  this.menuList.find(info => info.title === title);
      if (existMenu === null || existMenu === undefined)  { // 如果存在不添加，当前表示选中
        this.menuList.push(menu);
      } else {
        existMenu.isSelect = true;
      }
      this.setIndex(this.menuList.findIndex(u => u.title === title));
    });
  }
  ngOnInit() {
    this.getUser();
    this.updatePasswordForm = this.fb.group({
      oldPassword: [ null, [ Validators.required ] ],
      newPassword: [ null, [ Validators.required ] ],
      confirmPassword: [ null, [ Validators.required ] ]
    });
  }
  // 获取系统消息
  setIndex(index: number) {
    this.index = index;
  }

  navigateTo(module: string) {
    this.router.navigate([module]);
  }
  // 关闭选项标签
  closeUrl(module: string, isSelect: boolean, event: any) {
    console.log(module);
    event.stopPropagation();
    // 当前关闭的是第几个路由
    const index = this.menuList.findIndex(p => p.module === module);
    // 如果只有一个不可以关闭
    if (this.menuList.length === 1) {
      return;
    }
    this.menuList = this.menuList.filter(p => p.module !== module);
    // 删除复用
    console.log('module', module);
    ReuseStrategy.deleteRouteSnapshot(module);
    if (!isSelect) {
       return;
    }
    // 显示上一个选中
    let menu = this.menuList[index - 1];
    if (!menu) {// 如果上一个没有下一个选中
       menu = this.menuList[index + 1];
    }
    // console.log(menu);
    // console.log(this.menuList);
    this.menuList.forEach(p => p.isSelect = p.module === menu.module );
    // 显示当前路由信息
    this.router.navigate([menu.module]);
  }
  // 关闭除自己以外的其他标签页
  closeOtherTabs() {
    if (this.menuList.length === 1) {
      return;
    }
    const otherTabs = this.menuList.filter(u => u.isSelect === false);
    this.menuList = this.menuList.filter(u => u.isSelect === true);
    otherTabs.forEach(item => {
      ReuseStrategy.deleteRouteSnapshot(item.module);
    });
  }
  // 关闭除首页外的所有标签
  closeAllTabs() {
    this.menuList.forEach(item => {
      ReuseStrategy.deleteRouteSnapshot(item.module);
    });
    this.menuList = [{ title: '首页', module: 'pages/index', isSelect: true }];
    this.router.navigate(['/pages/index']);
  }
  // 退出登录
  logout() {
    this.authService.logout().subscribe(() => {
      this.authService.token = null;
      this.router.navigate(['/auth/login']);
      this.menuList.forEach(item => {
        ReuseStrategy.deleteRouteSnapshot(item.module);
      });
    });
  }

  getLink(rooter) {
    if (rooter) {
      this.router.navigate(['/' + rooter]);
    }
  }
  setSkin(colorName) {
    if (colorName === 'ink') {
      this.theme = 'light';
      this.style = {
        defaultColor: {
          'background-color': '#424242'
        },
        butColor: {
          'background-color': '#424242',
          'border-color': 'rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)'
        },
        aStyle: {
          'background-color': '#4f4f4f'
        }
      };
    }
  }

  // 设置用户头像
  getUser() {
    this.authService.getUser().then((res: any) => {
        localStorage.setItem('accountInfo', JSON.stringify(res));
        if (res.avatar) {
          this.avatar = res.avatar;
        } else {
          if (res.gender === 1) {
            this.avatar = '../../assets/image/boy-avatar.png';
          } else if (res.gender === 2) {
            this.avatar = '../../assets/image/girl-avatar.png';
          } else {
            this.avatar = '../../assets/image/boy-avatar.png';
          }
        }
        if (res.name) {
          this.name = res.name;
        } else {
          this.name = res.account;
        }
      }
    );
  }

  // 获取菜单以及有权限的菜单
  getMenu() {
    this.authService.getUser().then((u: any) => {
      const tempMenu = [];
      u.roles.map(role => {
        role.moduleIds.forEach(moduleId => tempMenu.push(moduleId));
      });
      const myMenu = tempMenu.filter((x, index, self) => self.indexOf(x) === index);
      this.authService.getMenu(u.menuId).then((menu: any) => {
        this.leftMenuList = menu.children;
        this.filterMenu(this.leftMenuList, myMenu);
        this.deleteChildren(this.leftMenuList);
        this.deleteSelf(this.leftMenuList);
      });
    });
  }
  filterMenu(data, moduleIds) {
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].moduleId && moduleIds.indexOf(data[i].moduleId) < 0) {
        data.splice(i, 1);
      } else if (data[i].children) {
        this.filterMenu(data[i].children, moduleIds);
      }
    }
  }
  deleteChildren(data) {
    data.map(u => {
      if (u.children.length === 0) {
        delete u.children;
      } else {
        this.deleteChildren(u.children);
      }
    });
  }
  deleteSelf(data) {
    for (let i = data.length - 1; i >= 0; i--) {
      if (!data[i].moduleId && !data[i].children) {
        data.splice(i, 1);
      } else if (data[i].children) {
        this.deleteSelf(data[i].children);
      }
    }
  }
}
