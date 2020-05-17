import React from 'react';
import './ExchangeInfo.css';
import { Row, Col } from 'reactstrap';

export class ExchangeInfo extends React.Component {
  constructor(props) {
    super(props);
    this.transactions = [];
  }

  render() {
    return (
      <Row style={{backgroundColor: "#182733"}}>
        <Col xs="12">
          <div className="ExchangeData">
            <h6>{this.props.exchangeData.exchange_ticker} - {this.props.exchangeData.name}</h6>
            <p>{this.props.exchangeData.address}, {this.props.exchangeData.country}</p>
            <table>
              <thead>
                <tr>
                  <th>Buy Volume</th>
                  <th>Sell Volume</th>
                  <th>Total Volume</th>
                  <th># Stocks</th>
                  <th>Market Share</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.props.buyVolume}</td>
                  <td>{this.props.sellVolume}</td>
                  <td>{this.props.sellVolume + this.props.buyVolume}</td>
                  <td>{this.props.exchangeData.listed_companies.length}</td>
                  <td>{this.props.marketShare}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
      </Row>

    );
  }
}
