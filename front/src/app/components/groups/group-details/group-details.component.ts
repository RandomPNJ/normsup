import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {

  group$: Observable<any>;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService
  ) { }

  ngOnInit() {
    this.group$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.httpService.get('/api/groups/'+params.get('id'))
      ));
  }

}
