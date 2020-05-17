import React from 'react';
import { Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'

import './ExchangeList.css';

class Exchange extends React.Component {
  constructor(props) {
    super(props);
    this.state =  { isOpen: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
    this.forceUpdate();
  }

  shouldComponentUpdate(nextProps) {
    const differentData = this.props.data !== nextProps.data;
    return differentData;
  }

  render() {
    return (
      <div className="Exchange">
      <div className="collapseButton" onClick={this.toggle}>
        <span color="primary">{this.props.data.exchange_ticker} </span>
        { this.state.isOpen ?
          <FontAwesomeIcon icon={faChevronDown} />
          :
          <FontAwesomeIcon icon={faChevronRight} />
        }
      </div>
      <Collapse isOpen={this.state.isOpen}>
        <div>
          <ul>
          { this.props.data.listed_companies.map((comp, i) =>
              <li key={i}
                  onClick={this.props.clickAction}
                  stockname={comp}
                  exchangename={this.props.data.exchange_ticker}>
                {comp}
              </li>
            )
          }
          </ul>
        </div>
      </Collapse>
      </div>
    );
  }
}

export class ExchangeList extends React.Component {

  render() {
    return (
      <div className="ExchangeList">
        { Object.keys(this.props.exchanges).map((k, i) => {
            return <Exchange key={i} data={this.props.exchanges[k]} clickAction={this.props.clickAction}/>
          })
        }
      </div>
    );
  }
}
