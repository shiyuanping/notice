import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicListService } from '../../@core/components/public-list/public-list.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
  providers: [PublicListService]
})
export class PreviewComponent {
  tenderInfo = {
    numberNo: '',
    name: '',
    type: '',
    content: '',
    openTime: null
  };
  constructor(
    private activeRouter: ActivatedRoute,
    private listService: PublicListService
  ) {
    this.activeRouter.queryParams.subscribe(param => {
      if (param.id) {
        this.listService.getDetail(param.id).subscribe(data => {
          this.tenderInfo = data;
          document.getElementById('a').append(data.content);
        });
      } else {
        const tenderInfo = JSON.parse(localStorage.getItem('tenderInfo'));
        this.tenderInfo = tenderInfo;
        document.getElementById('a').append(tenderInfo.content);
      }
    });
  }
}
