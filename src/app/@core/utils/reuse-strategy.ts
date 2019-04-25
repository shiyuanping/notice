import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class ReuseStrategy implements RouteReuseStrategy {

    public static handlers: { [key: string]: DetachedRouteHandle } = {};

    private static waitDelete: string;

    static deleteRouteSnapshot(name: string): void {
      if (ReuseStrategy.handlers[name]) {
          delete ReuseStrategy.handlers[name];
      } else {
          ReuseStrategy.waitDelete = name;
      }
    }

    /** 表示对所有路由允许复用 如果你有路由不想利用可以在这加一些业务逻辑判断 */
    public shouldDetach(route: ActivatedRouteSnapshot): boolean {
      if (route.routeConfig.children) {
        return false;
      }
      return true;
    }

    /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象 */
    public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
      if (ReuseStrategy.waitDelete && ReuseStrategy.waitDelete === this.getRouteUrl(route)) {
          // 如果待删除是当前路由则不存储快照
          ReuseStrategy.waitDelete = null;
          return;
      }
      ReuseStrategy.handlers[this.getRouteUrl(route)] = handle;
    }

    /** 若 path 在缓存中有的都认为允许还原路由 */
    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
      if (route.routeConfig.children) {
        return false;
      }
      const url = this.getRouteUrl(route);
      const canAttach =  !!ReuseStrategy.handlers[url];
      console.log('url', url, canAttach);
      return canAttach;
    }

    /** 从缓存中获取快照，若无则返回nul */
    public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
      if (!route.routeConfig) {
          return null;
      }
      if (route.routeConfig.children) {
        return null;
      }
      const handler = ReuseStrategy.handlers[this.getRouteUrl(route)];
      return handler || null;
    }

    /** 进入路由触发，判断是否同一路由 */
    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
      return future.routeConfig === curr.routeConfig &&
          JSON.stringify(future.params) === JSON.stringify(curr.params);
    }

    private getRouteUrl(route: ActivatedRouteSnapshot) {
      let url = route['_routerState'].url;
      const index = url.indexOf('?');
      if (index >= 0) {
        url = url.substring(0, index);
      }
      return url;
    }
}
