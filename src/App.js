import React, { Component } from 'react';
import './App.css';
import { css } from 'glamor'
import { Container, Tab, Header } from 'semantic-ui-react'

import Welcome from './components/Welcome'
import EthContainer from './containers/EthContainer'
import BtcContainer from './containers/BtcContainer'
import LtcContainer from './containers/LtcContainer'

const tabsStyle = css({
  paddingTop: '1em',
})

const panes = [
  { menuItem: 'ETH', render: () => <Tab.Pane><EthContainer /></Tab.Pane> },
  { menuItem: 'BTC', render: () => <Tab.Pane><BtcContainer /></Tab.Pane> },
  { menuItem: 'LTC', render: () => <Tab.Pane><LtcContainer /></Tab.Pane> },
]

const CryptoTabs = () => <div>
    <hr />
    <Header as='h2'>Choose a currency to donate.</Header>
    <Tab menu={{ fluid: true, vertical: false }} panes={panes}  />
  </div>    

class App extends Component {

  render() {
    return (
      <div className="App">
        <Container className='App-header'>
          <Welcome />
          <CryptoTabs className={`${tabsStyle}`}/>
        </Container>
      </div>
    );
  }
}

export default App;
