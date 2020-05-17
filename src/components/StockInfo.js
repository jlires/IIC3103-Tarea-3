import React from 'react';
import './StockInfo.css';
import { Row, Col } from 'reactstrap';

export class StockInfo extends React.Component {
  constructor(props) {
    super(props);
    this.transactions = [];
  }

  // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
  timeConverter(UNIX_timestamp){
    const a = new Date(UNIX_timestamp);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    //const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    const time = this.strPad(hour) + ':' + this.strPad(min) + ':' + this.strPad(sec) ;
    return time;
  }

  strPad(n) {
    return String("00" + n).slice(-2);
  }

  render() {
    let sell_data = this.props.data_sell;
    let buy_data = this.props.data_buy;
    let price_data = this.props.data_price;
    if (typeof(sell_data) === "undefined") sell_data = [];
    if (typeof(buy_data) === "undefined") buy_data = [];
    if (typeof(price_data) === "undefined") price_data = [];
    price_data = price_data.map((o) => o.value);

    let transactions = sell_data.map((o) => {o.type="sell"; return o}).concat(
                       buy_data.map((o) => {o.type="buy"; return o}));
    transactions.sort((a,b) => b.time - a.time );

    // Information
    const totalSellVolume = sell_data.reduce((t,n) => (t + n.volume), 0);
    const totalBuyVolume = buy_data.reduce((t,n) => (t + n.volume), 0);
    const maxPrice = Math.max(...price_data);
    const minPrice = Math.min(...price_data);
    const currentPrice = price_data[price_data.length - 1];
    const previousPrice = price_data[price_data.length - 2] || 0;
    const variation = ((currentPrice - previousPrice) / previousPrice).toFixed(2);

    return (
      <Row>
        <Col xs="12" md="12" lg="6">
          <div className="StockData">
            <table>
              <tbody>
              <tr>
                <th>Volume:</th>
                <td>{totalSellVolume + totalBuyVolume}</td>
              </tr>
              <tr>
                <th>High:</th>
                <td>{maxPrice}</td>
              </tr>
              <tr>
                <th>Low:</th>
                <td>{minPrice}</td>
              </tr>
              <tr>
                <th>Last Price:</th>
                <td>{currentPrice}</td>
              </tr>
              <tr>
                <th>Variation:</th>
                <td>{variation}%</td>
              </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs="12" md="12" lg="6">
        <div className="StockTradesData">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
            { transactions.map((o, i) => {
                if (o.type === "buy") {
                  return (
                    <tr key={i} className="buyOrder">
                      <td>{this.timeConverter(o.time)}</td>
                      <td>{o.volume}</td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={i} className="sellOrder">
                      <td>{this.timeConverter(o.time)}</td>
                      <td>{o.volume}</td>
                    </tr>
                  );
                }
              })
            }
            </tbody>

          </table>
        </div>
        </Col>
      </Row>

    );
  }
}
