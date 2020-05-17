import React from 'react';
//import logo from './logo.svg';
import './App.css';
import { createChart } from 'lightweight-charts';
import io from "socket.io-client";

// Components
import { Container, Row, Col } from 'reactstrap';
import { ExchangeList }  from './components/ExchangeList';
import { StockChart }  from './components/StockChart';
import { StockInfo }  from './components/StockInfo';
import { ExchangeInfo }  from './components/ExchangeInfo';
import Switch from 'react-switch';

// Utils
import { convertArrayToObject } from './utils.js';

const ENDPOINT = "wss://le-18262636.bitzonte.com";
const PATH = "/stocks";



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state =  { data: 0,
                    stocks: [],
                    exchanges: [],
                    stockShow: "",
                    connected: true,
                    stockShowing: "AAPL",
                    exchangeShowing: "",
                    exchangesTotalVolume: 0
                  };

    this.socket = null;
  }

  componentDidMount() {
    this.connectSocket();
  }

  connectSocket() {
    this.socket = io(ENDPOINT, { path: PATH });

    this.socket.emit('STOCKS');
    this.socket.on('STOCKS', (stocks) => {
      stocks.forEach((stock) => {
        if (typeof this.state["stock_" + stock.ticker] === "undefined") {
          this.setState({ ["stock_" + stock.ticker]: [],
                          ["stock_buy_" + stock.ticker]: [],
                          ["stock_sell_" + stock.ticker]: []
          });
        }
      });
      this.setState({ stocks: convertArrayToObject(stocks,"company_name") });
      this.socket.emit('EXCHANGES');
    });

    this.socket.on('EXCHANGES', (exchanges) => {
      this.setState({ exchanges: exchanges });
      for (const k in exchanges) {
        const exchange = exchanges[k];
        if (typeof this.state["exchange_buy_" + exchange.exchange_ticker] === "undefined") {
          this.setState({ ["exchange_buy_" + exchange.exchange_ticker]: 0,
                          ["exchange_sell_" + exchange.exchange_ticker]: 0
          });
        }
        exchange.listed_companies.forEach((company) => {
          this.setState({ ["stock_"+this.state.stocks[company].ticker+"_exchange"]: exchange.exchange_ticker });
        });
      }

      this.socket.on('UPDATE', (data) => {
        const stock_s = "stock_" + data.ticker;
        this.setState({ [stock_s]: [...this.state[stock_s],{time: data.time, value: data.value}] });
      });
      this.socket.on('BUY', (data) => {
        const stock_s = "stock_buy_" + data.ticker;
        const stock_exchange = this.state["stock_"+data.ticker+"_exchange"];
        this.setState({ [stock_s]: [...this.state[stock_s],{time: data.time, volume: data.volume}],
                        ["exchange_buy_"+stock_exchange]: this.state["exchange_buy_"+stock_exchange] + data.volume,
                        exchangesTotalVolume: this.state.exchangesTotalVolume + data.volume});
      });
      this.socket.on('SELL', (data) => {
        const stock_s = "stock_sell_" + data.ticker;
        const stock_exchange = this.state["stock_"+data.ticker+"_exchange"];
        this.setState({ [stock_s]: [...this.state[stock_s],{time: data.time, volume: data.volume}],
                        ["exchange_sell_"+stock_exchange]: this.state["exchange_sell_"+stock_exchange] + data.volume,
                        exchangesTotalVolume: this.state.exchangesTotalVolume + data.volume});
      });

      //if (this.state.stockShowing === "") this.setState({stockShowing: });
      //if (this.state.exchangeShowing === "") this.setState({exchangeShowing: });
    });
  }

  disconnectSocket() {
    this.socket.close();
  }

  toggleSwitch(checked) {
    const prev_state = this.state.connected;
    if (!prev_state) {
      this.connectSocket();
    } else {
      this.disconnectSocket();
    }
    this.setState({ connected: checked });
  };

  onStockClick(event) {
    // Change chart and current stock info
    const stock_name = event.target.getAttribute("stockname");
    const exchange_name = event.target.getAttribute("exchangename");
    this.updateStock(stock_name, exchange_name);

  }

  updateStock(stock_name, exchange_name) {
    this.setState({ stockShowing: this.state.stocks[stock_name].ticker,
                    stockShowingName: stock_name,
                    exchangeShowing: exchange_name
    });
  }

  render() {
    let currentExchangeSellVolume, currentExchangeBuyVolume,
        currentExchangeTotalVolume, currentExchangeMarketShare;

    if (this.state.exchangeShowing) {
      currentExchangeSellVolume = this.state["exchange_sell_"+this.state.exchangeShowing];
      currentExchangeBuyVolume = this.state["exchange_buy_"+this.state.exchangeShowing];
      currentExchangeTotalVolume = currentExchangeSellVolume + currentExchangeBuyVolume;
      currentExchangeMarketShare = ((currentExchangeTotalVolume / this.state.exchangesTotalVolume) * 100).toFixed(2);
    }

    return (
      <div className="App">
        <Container>
          <Row>
            <Col md="12" style={{textAlign: "left"}}>
              <label>
                <span style={{color: "white"}}>Connected </span>
                <Switch onChange={this.toggleSwitch.bind(this)}
                        checked={this.state.connected}
                        className="connection-switch" />
              </label>
            </Col>
          </Row>
          <Row style={{marginBottom: "0px"}}>
            <Col xs="12" md="3">
              <ExchangeList exchanges={this.state.exchanges}
                            clickAction={this.onStockClick.bind(this)} />
            </Col>
            { (this.state.stockShowing && this.state.exchangeShowing) ?
            <Col xs="12" md="9">
              <ExchangeInfo sellVolume={currentExchangeSellVolume}
                            buyVolume={currentExchangeBuyVolume}
                            marketShare={currentExchangeMarketShare}
                            exchangeData={this.state.exchanges[this.state.exchangeShowing]} />
              <Row>
                <Col md="12">
                  <div className="stockName">
                    <h1>{this.state.stockShowing} - {this.state.stockShowingName}</h1>
                    <p>{this.state.stocks[this.state.stockShowingName].country}</p>
                    <p>{this.state.stocks[this.state.stockShowingName].quote_base}</p>
                  </div>
                </Col>
                <Col md="12">
                  <StockChart stock={this.state.stockShowing}
                              data={this.state["stock_" + this.state.stockShowing]} />
                </Col>
              </Row>
              <StockInfo data_sell={this.state["stock_sell_" + this.state.stockShowing]}
                         data_buy={this.state["stock_buy_" + this.state.stockShowing]}
                         data_price={this.state["stock_" + this.state.stockShowing]} />
            </Col>
            :
            <Col xs="12"
                 md="9"
                 style={{height:"80vh", display:"flex", alignItems:"center"}}>
              <h4 style={{width:"100%"}}>Select a stock...</h4>
            </Col>
            }
          </Row>

        </Container>
      </div>
    );
  }
}

export default App;
