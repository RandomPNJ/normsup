import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-non-conform',
  templateUrl: './non-conform.component.html',
  styleUrls: ['./non-conform.component.scss']
})
export class NonConformComponent implements OnInit {

  @Input() notConform: any;
  constructor() { }

  ngOnInit() {
  }

}
