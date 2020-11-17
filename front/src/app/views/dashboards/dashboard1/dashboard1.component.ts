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
	@ViewChild('conformityPerGrp') private conformityPerGrpRef: ElementRef;
	
	public context: CanvasRenderingContext2D;
	public conformityPerGrpContext: CanvasRenderingContext2D;

	// General data
	public halfDoughnut: any;
	public conformityChart: any;
	public confPerGrpBar: any;
	public reminders: Array<any>;
	public groupSColors: Array<string> = ['#4390EF', '#C7E0FF', '#4E5983'];
	public showConformRateGraph: Boolean = false;

	public nbSuppliers: any;
	public conform: any;
	public notConform: any;
	public offline: any;

	// All chart types
	public conformityPerGrpType = 'bar';
	public conformityType = 'doughnut';

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

	

	constructor(private httpService: HttpService) {
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
				console.log('meta', meta);
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
					// ctx.arc(
					// 	radius * Math.sin(angle), 
					// 	radius * Math.cos(angle), 
					// 	thickness, 
					// 	0, 
					// 	2 * Math.PI);
					ctx.closePath();
					ctx.fill();
					ctx.restore();
				});
			},
		});
			
		let draw = Chart.controllers.line.prototype.draw;
		Chart.controllers.line = Chart.controllers.line.extend({
			draw: function() {
				let ctx = this.chart.chart.ctx;
				ctx.save();
				ctx.shadowColor = '#4E5983';
				ctx.shadowBlur = 12;
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 5;
				ctx.stroke();
				draw.apply(this, arguments);
				ctx.restore();
			}
		});

		let d = Chart.controllers.doughnut.prototype.draw;
		Chart.controllers.doughnut = Chart.controllers.doughnut.extend({
			draw: function() {
				d.apply(this, arguments);
				let ctx = this.chart.chart.ctx;
				let _fill = ctx.fill;
				ctx.fill = function() {
					ctx.save();
					ctx.shadowColor = '#00000029';
					ctx.shadowBlur = 15;
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					_fill.apply(this, arguments)
					ctx.restore();
				}
			}
		});
	}

	ngOnInit() {
		this.httpService
			.get('/api/suppliers/dash')
			.subscribe(res => {
				if(res.body) {
					if(res.body['count'] && res.body['count'] !== -1) {
						this.nbSuppliers = res.body['count'];
					} else {
						this.nbSuppliers = 0; 
					}
					if(res.body['conform'] && res.body['conform'] !== -1) {
						this.conform = res.body['conform'];
					} else {
						this.conform = 0;
					}
					if(res.body['offline'] && res.body['offline'] !== -1) {
						this.offline = res.body['offline'];
					} else {
						this.offline = 0;
					}
					this.notConform = this.nbSuppliers >= this.conform ? this.nbSuppliers - this.conform : 0;
				}
				this.showConformRateGraph = true;
			}, err => {
				console.log('[StatsCardComponent] getSuppliers count', err);
				this.nbSuppliers = 0;
				this.conform = 0;
				this.notConform = 0;
				this.offline = 0;
			})
		;
	}

	ngAfterViewInit() {
		// this.context = (<HTMLCanvasElement>this.conformityDoughnutRef.nativeElement).getContext('2d');
		// this.halfDoughnut = new Chart(this.context, {
		// 	type: 'RoundedDoughnut',
		// 	// type: this.conformityType,
		// 	data: this.conformityRateSet,
		// 	options: this.conformityDOptions
		// });
		

		// this.conformityPerGrpContext = (<HTMLCanvasElement>this.conformityPerGrpRef.nativeElement).getContext('2d');
		// this.confPerGrpBar = new Chart(this.conformityPerGrpContext, {
		// 	type: this.conformityPerGrpType,
		// 	data: this.confPerGrpSet,
		// 	options: this.confPerGrpOptions
		// });

	}

}

