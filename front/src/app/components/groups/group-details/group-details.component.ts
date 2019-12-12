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
  suppliers: any[] = [];

  id: Number;
  activateReminders: Boolean = false;
  freq: any;
  groupName: string;
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
    { name: '5 jours', value: '5d'},
    { name: '7 jours', value: '7d'},
    { name: '10 jours', value: '10d'},
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
    this.id = parseInt(this.route.snapshot.paramMap.get("id"), 10);
    this.httpService.get('/api/supplier/group/'+ this.id)
      .subscribe(res => {
        console.log('res', res);
        if(res.body && res.body['items']) {
          this.groupName = res.body['items'][0]['name'];
          this.activateReminders = !!res.body['items'][0];
          if(res.body['items'][0]['legal_docs'] !== "" && res.body['items'][0]['legal_docs'] !== null && res.body['items'][0]['legal_docs'] !== "null") {
            let legalSettings = res.body['items'][0]['legal_docs'].split('_');
            legalSettings.forEach(e => {
              if(e === 'u') {
                this.documentsSettings.legal.urssaf = true;
              }
              if(e === 'l') {
                this.documentsSettings.legal.lnte = true;
              }
              if(e === 'k') {
                this.documentsSettings.legal.kbis = true;
              }
            });
          }
          this.documentsSettings.frequency = res.body['items'][0]['frequency'];
        }
      }, err => {
        console.log('err', err);
      })
    ;
    
    this.httpService.get('/api/supplier/group/'+ this.id + '/members')
      .subscribe(res => {
        console.log('res', res);
        if(res.body && res.body['items']) {
          this.suppliers = res.body['items'];
        }
      }, err => {
        console.log('err', err);
      })
    ;
      
  }



}
