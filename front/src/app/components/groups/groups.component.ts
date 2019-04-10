import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  selectedItem: string;
  items = [
    {
      name: 'name one'
    },
    {
      name: 'name two'
    }
  ];
  itemPluralMapping = {
    'group': {
      '=0': 'n\'avez aucun groupe',
      '=1': 'un groupe',
      'other': '# groupes'
    }
  };
  constructor() { }

  ngOnInit() {
  }


  selectItem(item) {
    this.selectedItem = item.name;
  }
}
