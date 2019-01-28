import React, { Component } from 'react';
import './App.css';
import './semantic/dist/semantic.min.css'
import { Container } from 'semantic-ui-react'

import Welcome from './components/Welcome'
import CryptoContainer from './containers/CryptoContainer'

require('dotenv').config()

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
