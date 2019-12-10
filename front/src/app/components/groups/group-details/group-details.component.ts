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
  suppliers: any[] = [
    {
      denomination: 'SFR',
    },
    {
      denomination: 'LOREZA',
    },
    {
      denomination: 'cqcq',
    },
    {
      denomination: 'SFCQscqsR',
    },
    {
      denomination: 'cqcqs',
    },
    {
      denomination: 'SFcqcsdR',
    },
    {
      denomination: 'SFcscR',
    },
    {
      denomination: 'cscs',
    },
    {
      denomination: 'SFcdsdcR',
    },
    {
      denomination: 'SFR',
    },
    {
      denomination: 'LOREZA',
    },
    {
      denomination: 'cqcq',
    },
    {
      denomination: 'SFCQscqsR',
    },
    {
      denomination: 'cqcqs',
    },
    {
      denomination: 'SFcqcsdR',
    },
    {
      denomination: 'SFcscR',
    },
    {
      denomination: 'cscs',
    },
    {
      denomination: 'SFcdsdcR',
    },
    {
      denomination: 'SFR',
    },
    {
      denomination: 'LOREZA',
    },
    {
      denomination: 'cqcq',
    },
    {
      denomination: 'SFCQscqsR',
    },
    {
      denomination: 'cqcqs',
    },
    {
      denomination: 'SFcqcsdR',
    },
    {
      denomination: 'SFcscR',
    },
    {
      denomination: 'cscs',
    },
    {
      denomination: 'SFcdsdcR',
    },
    {
      denomination: 'SFR',
    },
    {
      denomination: 'LOREZA',
    },
    {
      denomination: 'cqcq',
    },
    {
      denomination: 'SFCQscqsR',
    },
    {
      denomination: 'cqcqs',
    },
    {
      denomination: 'SFcqcsdR',
    },
    {
      denomination: 'SFcscR',
    },
    {
      denomination: 'cscs',
    },
    {
      denomination: 'SFcdsdcR',
    },
  ];

  activateReminders: Boolean = false;
  documentsSettings: any = {
    legal: {
      urssaf: false,
      lnte: false,
      kbis: false,
    },
    frequency: ''
  };
  compDocs: Array<any> = [
    { name: 'Complémentaire un', value: 'compone'},
    { name: 'Complémentaire deux', value: 'comptwo'},
  ];
  frequency: Array<any> = [
    { name: '5 jours', value: '5j'},
    { name: '7 jours', value: '7j'},
    { name: '10 jours', value: '10j'},
  ];
  itemPluralCount = {
    'suppliers': {
      '=0': '',
      '=1': '',
      'other': '#'
    }
  };
  itemPluralMapping = {
    'suppliers': {
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
