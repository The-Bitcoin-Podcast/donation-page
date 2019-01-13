import React, { Component } from 'react'
import { Tab, Header, Container } from 'semantic-ui-react'
import { css } from 'glamor'
import EthContainer from './EthContainer'
import BtcContainer from './BtcContainer'
import LtcContainer from './LtcContainer'
import Leaderboard from '../components/Leaderboard'

class CryptoContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            txns: []
        }
        this.panes = [
            { menuItem: 'ETH', render: () => <Tab.Pane><EthContainer onTxChange={this.handleTxChange} /></Tab.Pane> },
            { menuItem: 'BTC', render: () => <Tab.Pane><BtcContainer /></Tab.Pane> },
            { menuItem: 'LTC', render: () => <Tab.Pane><LtcContainer /></Tab.Pane> },
        ]
    }

    // TODO: this will have to change to not replace the txns, 
    // but add to them and not duplicate
    handleTxChange = (txns) => {
        this.setState({
            txns
        })
    }

    render() {
        return <div>
            <hr />
            <Header as='h2'>Choose a currency to donate.</Header>
            <Tab menu={{ fluid: true, vertical: false, color:'orange', inverted: true}} panes={this.panes}  />
            <Leaderboard txns={this.state.txns} />
        </div>
    }
}

export default CryptoContainer