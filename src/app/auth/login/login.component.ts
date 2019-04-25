import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      account: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
    });
  }

  get account() {
    return this.validateForm.get('account');
  }
  get password() {
      return this.validateForm.get('password');
  }

  signIn() {
    this.authService.login(this.validateForm.value).subscribe(
        res => {
          console.log(res);
            this.authService.token = res.token;
            console.log(this.authService.token);
            this.router.navigate(['/pages/index']);
        },
        error => {
            console.log(error);
            if (error.ok === false) {
              this.modalService.error({
                nzTitle: '登录失败',
                nzStyle: {'top': '30%'},
                nzContent: '账号或密码输入错误！',
                nzOnOk: () => this.validateForm.reset()
              });
            }
        }
    );
  }

}
