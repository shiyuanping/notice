import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.css']
})
export class UploadAvatarComponent implements OnInit {
  loading = false;
  avatarUrl: string;
  url: string;
  @Input() set avatar(value) {
    console.log(value);
    if (value) {
      this.avatarUrl = value.url;
    } else {
      this.avatarUrl = '';
    }
  }
  @Output() avatarChange = new EventEmitter<any>();

  constructor(private info: NzMessageService) {}
  ngOnInit() {
    const token = JSON.parse(localStorage.getItem('_user'))['access_token'];
    this.url = `${environment.oaApiHost}/api/v1/files/images?token=${token}`;
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      if (!isJPG && !isPNG) {
        this.info.error('只能上传jpg、jpeg、png格式的图片！');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.info.error('图片大小必须小于2MB!');
        observer.complete();
        return;
      }
      observer.next((isJPG || isPNG) && isLt2M);
    });
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    if (info.file.status === 'done') {
      const tempId = info.file.response[0].id;
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.loading = false;
        this.avatarUrl = img;
      });
      console.log(tempId);
      this.avatarChange.emit(tempId);
    }
  }

}
