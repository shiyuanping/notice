import { Injectable } from '@angular/core';
import { HttpService } from './../../utils/http.service';
import { ObjectTool } from './../../utils/object-tool';

@Injectable()

export class PublicListService {
  constructor( private http: HttpService) {}

  getTenderList(pageIndex: number, pageSize: number, keyword?: string, noticeType?: string) {
    return this.http.getD('api/v1/announcements', ObjectTool.simplify({
      pageIndex,
      pageSize,
      keyword,
      noticeType
    }));
  }

  addTenderInfo(item) {
    return this.http.postD(`api/v1/announcements`, item);
  }
  updateTender(id, item) {
    return this.http.putD(`api/v1/announcements/${id}`, item);
  }
  deleteTender(id) {
    return this.http.deleteD(`api/v1/announcements/${id}`);
  }

  getDetail(id) {
    return this.http.getD(`api/v1/announcements/${id}`);
  }
  release(id, item) {
    return this.http.putD(`api/v1/announcements/UpdateState/${id}?Ispublish=${item}`, item);
  }
}
