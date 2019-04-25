import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { PublicListService } from './public-list.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-public-list',
  templateUrl: './public-list.component.html',
  styleUrls: ['./public-list.component.css'],
  providers: [PublicListService]
})
export class PublicListComponent implements OnInit {
  isVisible = false;
  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link']                         // link and image, video
    ]
  };
  tenderList: any;
  tenderInfo = {
    numberNo: '',
    name: '',
    type: '',
    noticeType: '',
    content: '',
    ispublish: false,
    openTime: null
  };
  _type: string;
  @Input() set type(value: string) {
    console.log(value);
    this._type = value;
  };
  @ViewChild('tenderTemplate') tenderTemplate: TemplateRef<any>;
  constructor(
    private listService: PublicListService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getTenderList(1, 10);
  }

  getTenderList(pageIndex, pageSize) {
    this.listService.getTenderList(pageIndex, pageSize, null, this._type).subscribe(res => {
      this.tenderList = res;
    });
  }

  add() {
    this.tenderInfo = {
      numberNo: '',
      name: '',
      type: '',
      noticeType: this._type,
      content: '',
      ispublish: false,
      openTime: null
    };
    this. isVisible = true;
    const modal = this.modalService.create({
      nzTitle: `新增${this._type}`,
      nzWidth: 800,
      nzStyle: { top: '40px' },
      nzContent: this.tenderTemplate,
      nzFooter: [
        {
          label: '取消',
          shape: 'default',
          onClick: () => modal.destroy()
        },
        {
          label: '保存',
          type: 'primary',
          onClick: () => {
            this.listService.addTenderInfo(this.tenderInfo).subscribe(res => {
              this.message.success('新增成功！');
              this.getTenderList(1, 10);
              modal.destroy();
            });
          }
        },
        {
          label: '预览',
          type: 'danger',
          onClick: () => {
            const tenderInfo = this.tenderInfo;
            localStorage.removeItem('tenderInfo');
            localStorage.setItem('tenderInfo', JSON.stringify(tenderInfo));
            window.open(`/preview`);
          }
        }
      ]
    });
  }

  edit(id) {
    this.listService.getDetail(id).subscribe(data => {
      this.tenderInfo = data;
    });
    this.tenderInfo.noticeType = this._type;
    const modal = this.modalService.create({
      nzTitle: `编辑${this._type}`,
      nzWidth: 800,
      nzStyle: { top: '40px' },
      nzContent: this.tenderTemplate,
      nzFooter: [
        {
          label: '取消',
          shape: 'default',
          onClick: () => modal.destroy()
        },
        {
          label: '保存',
          type: 'primary',
          onClick: () => {
            console.log(this.tenderInfo);
            this.listService.updateTender(id, this.tenderInfo).subscribe(res => {
              this.message.success('编辑成功！');
              this.getTenderList(1, 10);
              modal.destroy();
            });
          }
        },
        {
          label: '预览',
          type: 'danger',
          onClick: () => {
            const tenderInfo = this.tenderInfo;
            localStorage.removeItem('tenderInfo');
            localStorage.setItem('tenderInfo', JSON.stringify(tenderInfo));
            window.open(`/preview`);
          }
        }
      ]
    });
  }
  delete(id) {
    this.listService.deleteTender(id).subscribe(res => {
      this.message.success('删除成功！');
      this.getTenderList(1, 10);
    });
  }
  release(id, ispublish) {
    this.listService.release(id, !ispublish).subscribe(() => {
      if (ispublish) {
        this.message.success('取消发布成功！');
        this.getTenderList(1, 10);
      } else {
        this.listService.getDetail(id).subscribe(data => {
          if (!data.openTime) {
            data.openTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
            this.listService.updateTender(id, data).subscribe(() => {
              this.getTenderList(1, 10);
              this.message.success('发布成功！');
            });
          } else {
            this.getTenderList(1, 10);
            this.message.success('发布成功！');
          }
        });
      }
    });
  }
}
