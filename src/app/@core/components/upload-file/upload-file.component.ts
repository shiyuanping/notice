import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';

class NzFile {
  uid: string;
  name: string;
  url: string;
  status: string;
  response?: any[];
}

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  // 上传参数配置
  url: string;

  nzFiles: NzFile[] = [];

  @Input() set uploadfile(files: any[]) {
    if (files) {
      this.nzFiles = [];
      files.forEach(u => {
          this.nzFiles.push({
            uid: u.fileMetaId,
            name: u.fileMetaName,
            url: u.url,
            status: 'done',
            response: [{
              id: u.fileMetaId,
              name: u.fileMetaName,
              suffix: u.suffix
            }]
          });
      });
    }
  }

  @Output() dataChange = new EventEmitter<any>();

  constructor(
    private info: NzMessageService
  ) {}

  ngOnInit() {
    const token = JSON.parse(localStorage.getItem('_user'))['access_token'];
    this.url = `${environment.oaApiHost}/api/v1/public-files?token=${token}`;
  }
  handleChange({file, fileList}) {
    if (file.status === 'done') {
      this.info.success(`${file.name} 文件上传成功！`);
    } else if (file.status === 'error') {
      this.info.error(`${file.name} 文件上传失败！`);
    }
    const data = fileList.filter( u => u.status === 'done').map(u => {
        return {
          fileMetaName: u.response[0]['name'],
          suffix: u.response[0]['suffix'],
          fileMetaId: u.response[0]['id'],
        };
    });
    this.dataChange.emit(data);
  }
}
