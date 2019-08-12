import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss']
})
export class Dashboard1Component implements OnInit {

  public map: any = { lat: 51.678418, lng: 7.809007 };
  public chart1Type = 'bar';
  public chart2Type = 'pie';
  public chart3Type = 'line';
  public chart4Type = 'radar';
  public chart5Type = 'doughnut';
  public months: Array<any>;

  public chartType = 'line';

  public nbFourni = 13;

  public chartDatasets: Array<any> = [
    {data: [50, 40, 60], label: 'Inscrit'},
    {data: [28, 80, 40], label: 'Non Inscrit'},
    {data: [28, 80, 40], label: 'Conforme'},
    {data: [28, 80, 40], label: 'Non Conforme'},
  ];
  public doughnutData: Array<any> = [
    {data: [110], label: 'Inscrit'}
  ];
  public chartLabels: Array<any>;

  public chartColors: Array<any> = [
  ];

  public dateOptionsSelect: any[];
  public bulkOptionsSelect: any[];
  public showOnlyOptionsSelect: any[];
  public filterOptionsSelect: any[];

  public chartOptions: any = {
    responsive: true,
    legend: {
      labels: {
        fontColor: '#5b5f62',
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#5b5f62',
        }
      }],
      xAxes: [{
        ticks: {
          fontColor: '#5b5f62',
        }
      }]
    },
    label: 'Taux de conformité fournisseurs'
  };
  public doughnutOpt: any = {
    responsive: true,
    cutoutPercentage: 90,
    maintainAspectRatio: false,
    elements: {
      arc: {
          borderWidth: 0
      }
    },
    tooltips: {
      enabled: false
    }
  };
  constructor() {

  }

  ngOnInit() {
    this.chartLabels = [];
    this.chartLabels.push(moment().startOf('month').format('MMMM'));
  }

}
