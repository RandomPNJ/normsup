import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';

@Component({
  selector: 'app-monthly-conformity',
  templateUrl: './monthly-conformity.component.html',
  styleUrls: ['./monthly-conformity.component.scss']
})
export class MonthlyConformityComponent implements OnInit {

  @ViewChild('conformityChart') private conformityChartRef: ElementRef;
  @Input() nbSuppliers: any;

  public lineContext: CanvasRenderingContext2D;
  public showConformityChart: Boolean = false;
  public conformityChartType = 'line';
  public lineChart: any;
  private months = ['Janv', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];

  /** Conformity chart **/
	public chartDatasets: any = {
		labels: [],
		datasets : [{
			label: "Taux de conformité",
			data: [],
			borderColor: "#4390EF",
			// backgroundColor: "red",
			// borderColor: "#fff",
			backgroundColor: "rgba(199,224,255, 0.3)",
			fill: true,
			pointRadius: 0,
			radius: 5,
		}]
	};

	public chartLabels: Array<any> = [];


	public chartOptions: any = {
		responsive: true,
		legend: {
			display: false
		},
		borderColor: "#4390EF",
		scales: {
			yAxes: [
				{
					gridLines: {
						color: '#F3F7FC',
						zeroLineColor: '#D3D3D3',
						zeroLineWidth: 2,
						drawBorder: false,
					},
					ticks: {
						callback: function(value, index, values) {
							if(value === 125) {
								return null;
							} else {
								return value;
							} 
						},
						fontColor: '#5b5f62',
						max: 125,
						min: 0,
						stepSize: 25
					},
				}
			],
			xAxes: [{
				gridLines: {
					color: '#F3F7FC',
					zeroLineColor: '#D3D3D3',
					zeroLineWidth: 2,
				},
				ticks: {
					fontColor: '#5b5f62',
				}
			}]
		},
		label: 'Taux de conformité fournisseurs'
  };

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.httpService
      .get('/api/suppliers/monthly_conformity')
      .subscribe(res => {
		if(res && res.body) {
			this.getConformityRateData(res.body)
				.then(() => {
					this.showConformityChart = true;
					this.initChart();
				})
			;
		}
      }, err => {
        console.log('[MonthlyConformityComponent] monthly_conformity err', err);
      })
    ;

  }


  initChart(data?) {
    this.lineContext = (<HTMLCanvasElement>this.conformityChartRef.nativeElement).getContext('2d');
    this.lineChart = new Chart(this.lineContext, {
			type: 'line',
			data: this.chartDatasets,
			options: this.chartOptions,
			//@ts-ignore
			lineAtIndex: [this.chartDatasets.datasets[0].data.length - 1]
		});
  }

  	getConformityRateData(data?) {
		console.log('[getConformityRateData] data', data);
		data = data.conformity;
		this.chartDatasets.labels.push(' ');
		Object.keys(data).forEach((year, index) => {
			// ?????
			console.log('[getConformityRateData] year', year);
			Object.keys(data[year]).forEach((month, i) => {
				/**
				 * First if => To initialize the dataset
				 * Second if => To close the dataset
				 * Third if => To populate the dataset
				 */
				console.log('[getConformityRateData] data[year][month]', data[year][month]);
				if(index === 0) {
					this.chartDatasets.datasets[0].data.push((data[year][month].legalConform / this.nbSuppliers) * 100);
				} else if(index === Object.keys(data).length-1) {
					this.chartDatasets.labels.push(this.months[parseInt(month, 10) - 1]);
					this.chartDatasets.datasets[0].data.push((data[year][month].legalConform / this.nbSuppliers) * 100);
				} else {
					this.chartDatasets.datasets[0].data.push((data[year][month].legalConform / this.nbSuppliers) * 100);
					this.chartDatasets.labels.push(this.months[parseInt(month, 10) - 1]);
				}

			});
		});
		this.chartDatasets.labels.push(' ');
		console.log('this.chartDatasets', this.chartDatasets)
		return Promise.resolve(true);
	}
}
