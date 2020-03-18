import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent implements OnInit {

  constructor(private httpService: HttpService) { }
  nbSuppliers: any;

  ngOnInit() {
    this.httpService
      .get('/api/supplier/count')
      .subscribe(res => {
        console.log('count res', res);
        if(res.body && res.body['count']) {
          this.nbSuppliers = res.body['count'];
        } else {
          this.nbSuppliers = 0; 
        }
      }, err => {
        console.log('[StatsCardComponent] getSuppliers count', err);
      })
    ;
  }

}
