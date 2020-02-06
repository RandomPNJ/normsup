import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
// import { Promise } from 'Bluebird';
import { HttpService } from 'src/app/services/http.service';


@Component({
	selector: 'app-dashboard1',
	templateUrl: './dashboard1.component.html',
	styleUrls: ['./dashboard1.component.scss']
})
export class Dashboard1Component implements OnInit, AfterViewInit {

	@ViewChild('conformityDoughnut') private conformityDoughnutRef: ElementRef;
	@ViewChild('conformityChart') private conformityChartRef: ElementRef;
	@ViewChild('groupSupplier') private groupSupplierRef: ElementRef;
	@ViewChild('conformityPerGrp') private conformityPerGrpRef: ElementRef;
	
	public context: CanvasRenderingContext2D;
	public lineContext: CanvasRenderingContext2D;
	public groupSContext: CanvasRenderingContext2D;
	public conformityPerGrpContext: CanvasRenderingContext2D;

	// General data
	public halfDoughnut: any;
	public conformityChart: any;
	public groupSDoughnut: any;
	public confPerGrpBar: any;
	public map: any = { lat: 51.678418, lng: 7.809007 };
	private months = ['Janv', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
	public nbFourni = 13;
	public reminders: Array<any>;
	public showConformityChart: Boolean = false;
	public groupSColors : Array<string> = ['#4390EF', '#C7E0FF', '#4E5983'];
	public groupData: Array<any> = [];

	// All chart types
	public conformityChartType = 'line';
	public conformityPerGrpType = 'bar';
	public conformityType = 'doughnut';
	public groupSupplierType = 'doughnut';

	/** Conformity doughnut configuration **/
	public conformityRateSet = {
		labels: [
			'Value'
		],
		datasets: [
			{
				data: [70, 30],
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
			}]
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
		cutoutPercentage: 70,
		rotation: 1 * Math.PI,
		circumference: 0.95 * Math.PI,
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
			display: true,
			text: 'Taux de conformité',
			position: 'bottom',
			fontColor: '#4E5983', //Default black
			fontFamily: 'Avenir Medium', //Default Arial,
			fontSize: 14
		}
	};


	/** Reminders table **/




	/** Conformity chart **/
	public chartDatasets: any = {
		labels: [],
		datasets : [{
			label: "Taux de conformité",
			data: [],
			borderColor: "#4390EF",
			backgroundColor: "#eef5ff",
			// borderColor: "#fff",
			// backgroundColor: "#fff",
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
			yAxes: [{
				ticks: {
					fontColor: '#5b5f62',
					max: 100,
					min: 0,
					stepSize: 25
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

	/** Group suppliers chart **/
	public groupSupplierSet = {
		labels: [
			'Value'
		],
		datasets: [
			{
				data: [62, 25, 13],
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

	/** Conformity per group chart **/
	public confPerGrpSet = {
		labels: [
			// 'Groupe 1', 'Groupe 2', 'Groupe 3', 'Groupe 4',
			'','','','',
		],
		datasets: [
			{
				data: [75, 90, 50, 75],
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

	public confPerGrpOptions: any = {
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
		scales: {
			yAxes: [{
				ticks: {
					fontColor: '#5b5f62',
					max: 100,
					min: 0,
					stepSize: 50
				}
			}],
			xAxes: [{
				ticks: {
					fontColor: '#5b5f62',
				}
			}]
		},
		title: {
			display: false,
			text: 'Taux de conformité par groupe de fournisseurs (en%)',
			position: 'top',
			fontColor: '#4E5983', //Default black
			fontFamily: 'Avenir Medium', //Default Arial,
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

	constructor(private http: HttpService) {
		// Custom tooltip
		Chart.defaults.global.tooltips.custom = function(tooltip) {
			// Tooltip Element
			var tooltipEl = $('#chartjs-tooltip');
			if (!tooltipEl[0]) {
			  $('body').append('<div id="chartjs-tooltip"></div>');
			  tooltipEl = $('#chartjs-tooltip');
			}
			// Hide if no tooltip
			if (!tooltip.opacity) {
			  tooltipEl.css({
				opacity: 0
			  });
			  $('.chartjs-wrap canvas').each(function(index, el) {
				$(el).css('cursor', 'default');
			  });
			  return;
			}
			$(this._chart.canvas).css('cursor', 'pointer');
			// Set caret Position
			tooltipEl.removeClass('above below no-transform');
			if (tooltip.yAlign) {
			  tooltipEl.addClass(tooltip.yAlign);
			} else {
			  tooltipEl.addClass('no-transform');
			}
			// Set Text
			if (tooltip['body']) {
			  var innerHtml = [
				(tooltip['beforeTitle'] || []).join('\n'), (tooltip['title'] || []).join('\n'), (tooltip['afterTitle'] || []).join('\n'), (tooltip['beforeBody'] || []).join('\n'), (tooltip['body'] || []).join('\n'), (tooltip['afterBody'] || []).join('\n'), (tooltip['beforeFooter'] || [])
				.join('\n'), (tooltip['footer'] || []).join('\n'), (tooltip['afterFooter'] || []).join('\n')
			  ];
			  tooltipEl.html(innerHtml.join('\n'));
			}
			// Find Y Location on page
			var top = 0;

			// console.log('tooltip.yAlign: ' + tooltip.yAlign);
			// console.log('tooltip.y: ' + tooltip.y);
			// console.log('tooltip.caretHeight: ' + tooltip.caretHeight);
			// console.log('tooltip.caretPadding: ' + tooltip.caretPadding);

			if (tooltip.yAlign) {
			  var ch = 0;
			  if (tooltip['caretHeight']) {
				ch = tooltip['caretHeight'];
			  }
			  if (tooltip.yAlign == 'above') {
				top = tooltip.y - ch - tooltip['caretPadding'];
			  } else {
				top = tooltip.y + ch + tooltip['caretPadding'];
			  }
			}

			// console.log('top: ' + top);

			var position = $(this._chart.canvas)[0].getBoundingClientRect();
			// Display, position, and set styles for font
			tooltipEl.css({
			  opacity: 1,
			  width: tooltip.width ? (tooltip.width + 'px') : 'auto',
			  left: position.left + tooltip.x + 'px',
			  top: position.top + top + 'px',
			  fontFamily: tooltip['_fontFamily'],
			  fontSize: tooltip['fontSize'],
			  fontStyle: tooltip['_fontStyle'],
			  padding: tooltip.yPadding + 'px ' + tooltip.xPadding + 'px',
			});
		  };

		// Custom vertical line
		const verticalLinePlugin = {
			getLinePosition: function (chart, pointIndex) {
				const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
				const data = meta.data;
				return data[pointIndex]._model.x;
			},
			renderVerticalLine: function (chartInstance, pointIndex) {
				const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
				const scale = chartInstance.scales['y-axis-0'];
				const context = chartInstance.chart.ctx;

				// render vertical line
				context.beginPath();
				context.strokeStyle = '#C7E0FF';
				context.lineWidth = 3;
				context.moveTo(lineLeftOffset, scale.top * 4);
				context.lineTo(lineLeftOffset, scale.bottom);
				context.stroke();

				// write label
				context.fillStyle = "#C7E0FF";
				context.textAlign = 'center';
				context.font = "11px Avenir Heavy"

				context.fillText('Aujourd\'hui', lineLeftOffset, scale.top * 3);
			},

			afterDatasetsDraw: function (chart, easing) {
				if (chart.config.lineAtIndex) {
					chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex));
				}
			}
		};
		Chart.plugins.register(verticalLinePlugin);

		// Make a rounded doughnut available
		Chart.defaults.RoundedDoughnut = Chart.helpers.clone(Chart.defaults.doughnut);
		Chart.controllers.RoundedDoughnut = Chart.controllers.doughnut.extend({
			draw: function (ease) {
				var ctx = this.chart.chart.ctx;

				var easingDecimal = ease || 1;
				Chart.helpers.each(this.getMeta().data, function (arc, index) {
					arc.transition(easingDecimal).draw();

					var vm = arc._view;
					var radius = (vm.outerRadius + vm.innerRadius) / 2;
					var thickness = (vm.outerRadius - vm.innerRadius) / 2;
					var angle = Math.PI - vm.endAngle - Math.PI / 2;

					ctx.save();
					ctx.fillStyle = vm.backgroundColor;
					ctx.translate(vm.x, vm.y);
					ctx.beginPath();
					ctx.arc(radius * Math.sin(angle), radius * Math.cos(angle), thickness, 0, 2 * Math.PI);
					// ctx.arc(radius * Math.sin(Math.PI), radius * Math.cos(Math.PI), thickness, 0, 2 * Math.PI);
					ctx.closePath();
					ctx.fill();
					ctx.restore();
				});
			},
		});
	}

	ngOnInit() {
		this.getReminderData();
		this.getConformityRateData()
			.then(() => {
				this.showConformityChart = true;
				this.initChart();
			})
		;
	}

	ngAfterViewInit() {
		this.context = (<HTMLCanvasElement>this.conformityDoughnutRef.nativeElement).getContext('2d');
		this.halfDoughnut = new Chart(this.context, {
			type: 'RoundedDoughnut',
			data: this.conformityRateSet,
			options: this.conformityDOptions
		});

		this.groupSContext = (<HTMLCanvasElement>this.groupSupplierRef.nativeElement).getContext('2d');
		this.groupSDoughnut = new Chart(this.groupSContext, {
			type: this.groupSupplierType,
			data: this.groupSupplierSet,
			options: this.groupSupplierOptions
		});

		this.conformityPerGrpContext = (<HTMLCanvasElement>this.conformityPerGrpRef.nativeElement).getContext('2d');
		this.confPerGrpBar = new Chart(this.conformityPerGrpContext, {
			type: this.conformityPerGrpType,
			data: this.confPerGrpSet,
			options: this.confPerGrpOptions
		});
	}

	initChart() {
		this.lineContext = (<HTMLCanvasElement>this.conformityChartRef.nativeElement).getContext('2d');
		this.halfDoughnut = new Chart(this.lineContext, {
			type: 'line',
			data: this.chartDatasets,
			options: this.chartOptions,
			//@ts-ignore
			lineAtIndex: [this.chartDatasets.datasets[0].data.length - 1]
		});
	}

	dayUntil(timestamp) {
		let todateSec = new Date(timestamp * 1000);
		let fromdateSec = new Date();

		// if (todateSec < fromdateSec)
			// alert('To date must be grater that from date!');

		// Calculate days between dates
		let millisecondsPerDay = 86400 * 1000; // Day in milliseconds
		fromdateSec.setHours(0, 0, 0, 1); // Start just after midnight
		todateSec.setHours(23, 59, 59, 999); // End just before midnight
		let diff = todateSec.getTime() - fromdateSec.getTime(); // Milliseconds between datetime objects 
		let days = Math.ceil(diff / millisecondsPerDay);

		// Subtract two weekend days for every week in between
		let weeks = Math.floor(days / 7);
		days = days - (weeks * 2);

		// Handle special cases
		let fromdateDay = fromdateSec.getDay();
		let todateDay = todateSec.getDay();

		// Remove weekend not previously removed. 
		if (fromdateDay - todateDay > 1)
			days = days - 2;

		// Remove start day if span starts on Sunday but ends before Saturday
		if (fromdateDay == 0 && todateDay != 6)
			days = days - 1;

		// Remove end day if span ends on Saturday but starts after Sunday
		if (todateDay === 6 && fromdateDay !== 0) {
			days = days - 1;
		}
		let leaveDays = days;
		//@ts-ignore
		if (leaveDays === 'NaN' || leaveDays === '' || leaveDays <= '0' || leaveDays == 'undefined') {
			//@ts-ignore
			leaveDays = '';
		} else {
			leaveDays = days;
		}

		return days;
	}

	getReminderData() {
		let reminders: Array<any> = [
			{
				groupName: 'Groupe 1',
				reminderAt: 1571475600,
			},
			{
				groupName: 'Groupe 2',
				reminderAt: 1571475600,
			},
			{
				groupName: 'Groupe 3',
				reminderAt: 1571475600,
			},
		];
		reminders.forEach(reminder => {
			reminder.daysUntil = this.dayUntil(reminder.reminderAt);
		});
		this.reminders = reminders;
	}

	getConformityRateData() {
		let data = [
			{
				rate: 25,
				date: moment()
			},
			{
				rate: 27,
				date: moment().add(1, 'M')
			},
			{
				rate: 35,
				date: moment().add(2, 'M')
			},
			{
				rate: 36,
				date: moment().add(3, 'M')
			},
			{
				rate: 40,
				date: moment().add(4, 'M')
			},
			{
				rate: 42,
				date: moment().add(5, 'M')
			},
			{
				rate: 50,
				date: moment().add(6, 'M')
			}
		];
		this.chartDatasets.labels.push(' ');
		data.forEach((rate, index) => {
			if(index === 0) {
				this.chartDatasets.datasets[0].data.push(rate.rate)
			}
			this.chartDatasets.datasets[0].data.push(rate.rate)
			this.chartDatasets.labels.push(this.months[rate.date.month()]);
		});
		this.chartDatasets.labels.push(' ');
		return Promise.resolve(true);
	}

}
