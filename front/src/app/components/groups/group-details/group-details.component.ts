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
  suppliers: any[];

  itemPluralCount = {
    'supplier': {
      '=0': '',
      '=1': '',
      'other': '#'
    }
  };
  itemPluralMapping = {
    'supplier': {
      '=0': 'Vous n\'avez aucun fournisseur dans ce groupe',
      '=1': 'Vous avez un fournisseur dans ce groupe',
      'other': 'fournisseurs dans ce groupe'
    }
  };

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
