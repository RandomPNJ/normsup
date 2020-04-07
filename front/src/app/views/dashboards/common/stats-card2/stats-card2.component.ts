import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card2',
  templateUrl: './stats-card2.component.html',
  styleUrls: ['./stats-card2.component.scss']
})
export class StatsCard2Component implements OnInit {

  @Input() conform;

  constructor() { }

  ngOnInit() {
  }

}
