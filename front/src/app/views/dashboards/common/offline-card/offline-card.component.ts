import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offline-card',
  templateUrl: './offline-card.component.html',
  styleUrls: ['./offline-card.component.scss']
})
export class OfflineCardComponent implements OnInit {

  @Input() offline: any = 0;

  constructor() { }

  ngOnInit() {
  }

}
