import React, { Component } from 'react';
import './App.css';
import { css } from 'glamor'
import { Container, Tab, Header } from 'semantic-ui-react'

import Welcome from './components/Welcome'
import CryptoContainer from './containers/CryptoContainer'



class App extends Component {

  render() {
    return (
      <div className="App">
        <Container className='App-header'>
          <Welcome />
          <CryptoContainer />
        </Container>
      </div>
    );
  }
}

export default App;
