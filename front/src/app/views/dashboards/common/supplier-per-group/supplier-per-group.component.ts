import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { floor } from 'lodash';

@Component({
	selector: 'app-supplier-per-group',
	templateUrl: './supplier-per-group.component.html',
	styleUrls: ['./supplier-per-group.component.scss']
})
export class SupplierPerGroupComponent implements OnInit {

	@ViewChild('groupSupplier') private groupSupplierRef: ElementRef;

	// General variables
	public groupSContext: CanvasRenderingContext2D;
	public groupSDoughnut: any;
	public groupSupplierType = 'doughnut';
	public groupSColors: Array<string> = ['#4390EF', '#C7E0FF', '#4E5983'];
	public groupData: Array<any> = [];
	public groupNames: Array<any> = [];

	public showEmptyMessage: Boolean = false;
	private showGraph: Boolean = false;

	/** Group suppliers chart **/
	public groupSupplierSet = {
		labels: [
			'Value'
		],
		datasets: [
			{
				data: [],
				backgroundColor: [
					"#4390EF",
					"#C7E0FF",
					'#4E5983'
				],
				hoverBackgroundColor: [
					"#4390EF",
					"#C7E0FF",
					'#4E5983'
				]
			}]
	};

	public groupSupplierOptions: any = {
		aspectRatio: 1,
		layout: {
			padding: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
			}
		},
		responsive: true,
		cutoutPercentage: 65,
		tooltips: {
			enabled: false
		},
		animation: {
			animationRotate: true,
			duration: 2000
		},
		legend: {
			display: false
		},
		elements: {
			arc: {
				borderWidth: 0
			}
		},
		title: {
			display: false,
			text: 'Fournisseur par groupe (en %)',
			position: 'top',
			fontColor: '#4E5983', //Default black
			fontFamily: 'Roboto Regular', //Default Arial,
			fontSize: 14
		},
		plugins: {
			labels: {
				// mode 'label', 'value' or 'percentage', default is 'percentage'
				render: 'value',

				// precision for percentage, default is 0
				precision: 0,

				// font size, default is defaultFontSize
				fontSize: 13,

				// font color, default is '#fff'
				fontColor: '#fff',

				// font style, default is defaultFontStyle
				fontStyle: 'bold',

				// font family, default is defaultFontFamily
				fontFamily: "'Roboto Regular', 'Roboto'"
			}
		}
	};

	constructor(private httpService: HttpService) { }

	ngOnInit() {
		this.httpService
			.get('/api/suppliers/groups')
			.subscribe(res => {
				console.log('count res', res);
				if (res.body && res.body['items']) {
					console.log("res.body['items']", res.body['items']);
					res.body['items'].forEach(element => {
						if(element.members_count > 0) {
							this.groupSupplierSet.datasets[0].data.push(floor(element.members_count / element.total * 100, 1));
							this.groupNames.push(element.name)
						}
					});
					if (this.groupSupplierSet.datasets[0].data.length === 0) {
						this.showEmptyMessage = true;
					} else {
						this.showGraph = true;
						this.groupSContext = (<HTMLCanvasElement>this.groupSupplierRef.nativeElement).getContext('2d');
						this.groupSDoughnut = new Chart(this.groupSContext, {
							type: this.groupSupplierType,
							data: this.groupSupplierSet,
							options: this.groupSupplierOptions
						});
					}
					console.log('this.groupSupplierSet.datasets[0].data', this.groupSupplierSet.datasets[0].data);
				}
			}, err => {
				console.log('[StatsCardComponent] getSuppliers items', err);
			})
			;
	}

	ngAfterViewInit(): void {
		//Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		//Add 'implements AfterViewInit' to the class.
		this.groupSContext = (<HTMLCanvasElement>this.groupSupplierRef.nativeElement).getContext('2d');
		this.groupSDoughnut = new Chart(this.groupSContext, {
			type: this.groupSupplierType,
			data: this.groupSupplierSet,
			options: this.groupSupplierOptions
		});
	}

}
