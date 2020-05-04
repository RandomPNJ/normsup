import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';

@Component({
  selector: 'app-conformity-rate-graph',
  templateUrl: './conformity-rate-graph.component.html',
  styleUrls: ['./conformity-rate-graph.component.scss']
})
export class ConformityRateGraphComponent implements OnInit, AfterViewInit {


  @ViewChild('conformityDoughnut') private conformityDoughnutRef: ElementRef;

  @Input() nbSuppliers;
  @Input() conform;

	public context: CanvasRenderingContext2D;

	public conformityType = 'doughnut';
  public halfDoughnut: any;
  private show: Boolean = false;
  private intervalID: any;

  /** Conformity doughnut configuration **/
  public conformityRateSet = {
    labels: [
      'Value'
    ],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#4390EF",
          "#C7E0FF"
        ],
        hoverBackgroundColor: [
          "#4390EF",
          "#C7E0FF"
        ],
        borderWidth: [
          0, 0
        ]
      }
    ]
  };

  public conformityDColor: Array<any> = [
    {
      backgroundColor: ['#4390EF', '#C7E0FF'],
      hoverBackgroundColor: ['#4390EF', '#C7E0FF'],
      borderWidth: 2,
    }
  ];

  public conformityDOptions: any = {
    responsive: true,
    cutoutPercentage: 74,
    rotation: 1 * Math.PI,
    // circumference: 0.95 * Math.PI,
    circumference: 1 * Math.PI,
    tooltips: {
      enabled: false
    },
    animation: {
      animationRotate: true,
      duration: 2000
    },
    legend: {
      enabled: false,
      display: false,
      position: 'bottom'
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    title: {
      display: false,
      text: 'Taux de conformité',
      position: 'bottom',
      fontColor: '#4E5983', //Default black
      fontFamily: 'Avenir Medium', //Default Arial,
      fontSize: 14
    }
  };


  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.intervalID = setInterval(() => {
      if(this.nbSuppliers === 0) {
        this.conformityRateSet.datasets[0].data.push(0);
        this.conformityRateSet.datasets[0].data.push(100);
        this.context = (<HTMLCanvasElement>this.conformityDoughnutRef.nativeElement).getContext('2d');
        this.halfDoughnut = new Chart(this.context, {
          type: 'RoundedDoughnut',
          data: this.conformityRateSet,
          options: this.conformityDOptions
        });
        this.stopInterval();
      } else if((this.nbSuppliers || this.nbSuppliers === 0) && (this.conform || this.conform === 0) && (this.conform <= this.nbSuppliers)) {
        this.show = true;
        let v = Math.round(this.conform / this.nbSuppliers * 100);
        this.conformityRateSet.datasets[0].data.push(v);
        this.conformityRateSet.datasets[0].data.push(100-v);
        this.context = (<HTMLCanvasElement>this.conformityDoughnutRef.nativeElement).getContext('2d');
        this.halfDoughnut = new Chart(this.context, {
          type: 'RoundedDoughnut',
          data: this.conformityRateSet,
          options: this.conformityDOptions
        });
        this.stopInterval();
      }
    }, 1000);
  }

  private stopInterval() {
    clearInterval(this.intervalID);
  }
}
