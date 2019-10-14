import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  public chart5Type = 'doughnut';
  public nbFourni = 13;
  public chartColors: Array<any> = [
    {
      backgroundColor: ['#4390EF', '#C7E0FF'],
      hoverBackgroundColor: ['#4390EF', '#C7E0FF'],
      borderWidth: 2,
    }
  ];
  public doughnutOpt: any = {
    responsive: true,
    cutoutPercentage: 70,
    maintainAspectRatio: false,
    
    tooltips: {
      enabled: true
    }
  };

  public chartLabelsOne : Array<any> = [
    'Document non conforme', "Documents conformes"
  ];
  public doughnutDataOne: Array<any> = [
    {data: [75, 25]},
  ];
  public doughnutDataTwo: Array<any> = [
    {data: [110], label: 'Inscrit'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
