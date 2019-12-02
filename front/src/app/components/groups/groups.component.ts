import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  items: any;

  constructor(
    private httpService: HttpService, private router: Router) { }

  ngOnInit() {
  }

  onActivate(e) {
    console.log('onActivate', e);
  }

  getGroupsData(e) {
    console.log('getGroupsData', e);
  }
}
