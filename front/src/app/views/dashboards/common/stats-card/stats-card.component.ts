import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent implements OnInit {

  @Input() nbSuppliers: any;

  constructor() { }

  ngOnInit() {
    ;
  }

}
