import React from 'react';
import { createChart } from 'lightweight-charts';

import './StockChart.css';


export class StockChart extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.lineSeries = null;

    this.chartContainer = React.createRef();
    this.chartTooltip = React.createRef();
  }

  componentDidMount() {
    // Generate chart
    this.chart = createChart(document.getElementById("AppChart"),
                              { width: 600,
                                height: 350,
                                fixLeftEdge: true,
                                localization: {
                                  locale: 'es-CL',
                                  dateFormat: 'dd/mm/yyyy',
                                },
                              	priceScale: {
                              		scaleMargins: {
                              			top: 0.3,
                              			bottom: 0.25,
                              		},
                              		borderVisible: false,
                              	},
                              	layout: {
                              		backgroundColor: '#131722',
                              		textColor: '#d1d4dc',
                              	},
                              	grid: {
                              		vertLines: {
                              			color: 'rgba(42, 46, 57, 0)',
                              		},
                              		horzLines: {
                              			color: 'rgba(42, 46, 57, 0.6)',
                              		},
                              	},
                                timeScale: {
                                  timeVisible: true,
                                },
    });
    // Initialize empty line series
    //this.lineSeries = this.chart.addLineSeries([]);
    this.lineSeries = this.chart.addAreaSeries({
    	topColor: 'rgba(38,198,218, 0.56)',
    	bottomColor: 'rgba(38,198,218, 0.04)',
    	lineColor: 'rgba(38,198,218, 1)',
    	lineWidth: 2,
    });
    this.chart.timeScale().applyOptions({ fixLeftEdge: true });

    window.addEventListener('resize', (event) => {
      this.chart.resize(document.getElementById("AppChart").clientWidth, 350);
    });

    this.chart.resize(document.getElementById("AppChart").clientWidth, 350);

    const toolTipWidth = 120;
    const toolTipHeight = 100;
    const toolTipMargin = 15;
    const width = 600;
    const height = 300;

    let tooltip = document.getElementById("AppChartTooltip");
    // update tooltip
    this.chart.subscribeCrosshairMove((param) => {
    	if (!param.time || param.point.x < 0 || param.point.x > width || param.point.y < 0 || param.point.y > height) {
    		tooltip.style.display = 'none';
    		return;
    	}

    	var dateStr = this.datetimeConverter(param.time*1000);

    	tooltip.style.display = 'block';
    	var price = param.seriesPrices.get(this.lineSeries);

    	//tooltip.innerHTML = '<div style="color: rgba(255, 70, 70, 1)">Apple Inc.</div>' +
    	//	'<div style="font-size: 24px; margin: 4px 0px">' + Math.round(price * 100) / 100 + '</div>' +
    	//	'<div>' + dateStr + '</div>';

    	tooltip.innerHTML = '<div style="font-size: 24px; margin: 4px 0px">' + Math.round(price * 100) / 100 + '</div>' +
    		'<div>' + dateStr + '</div>';

    	var y = param.point.y;

    	var left = param.point.x + toolTipMargin;
    	if (left > width - toolTipWidth) {
    		left = param.point.x - toolTipMargin - toolTipWidth;
    	}

    	var top = y + toolTipMargin;
    	if (top > height - toolTipHeight) {
    		top = y - toolTipHeight - toolTipMargin;
    	}

    	tooltip.style.left = left + 'px';
    	tooltip.style.top = top + 'px';
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.updateChart(nextProps.data)
    }
    return false;
  }

  updateChart(data_price){
    this.lineSeries.setData(data_price);
    this.chart.timeScale().applyOptions({ rightOffset: 12 });
    //this.chart.timeScale().applyOptions({
    //  rightOffset: data_price[0].time,
    //});
  }

  businessDayToString(businessDay) {
    return businessDay.year + '-' + businessDay.month + '-' + businessDay.day;
  }

  // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
  datetimeConverter(UNIX_timestamp){
    const a = new Date(UNIX_timestamp);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const datetime = date + ' ' + month + ' ' + year + ' ' + this.strPad(hour) + ':' + this.strPad(min) + ':' + this.strPad(sec) ;
    return datetime;
  }

  strPad(n) {
    return String("00" + n).slice(-2);
  }

  render() {
    return (
      <div ref={this.chartContainer} id="AppChart" className="AppChart">
        <div ref={this.chartTooltip} id="AppChartTooltip" className="floating-tooltip-2"></div>
      </div>
    );
  }
}
