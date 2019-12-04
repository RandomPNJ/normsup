import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';
import { GroupsService } from 'src/app/services/groups.service';


@Component({
  selector: 'app-groups',
  providers: [GroupsService],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  items: any;
  groups: any;
  first: Boolean = false;
  constructor(
    private httpService: HttpService, 
    private router: Router, 
    private groupsService: GroupsService) { 

      this.groupsService.groups$.subscribe(n => {
        if(!this.first && n && n.length > 0) {
          this.groups = n;
          this.first = true;
          console.log('here', n)
        }
      });
    }

  ngOnInit() {
  }

  onActivate(e) {
    console.log('onActivate', e);
  }

  getGroupsData(e) {
    console.log('getGroupsData', e);
  }
}
