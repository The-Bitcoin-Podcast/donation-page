import React, { Component } from 'react'
import { Tab, Header } from 'semantic-ui-react'
import Web3 from 'web3'
import EthContainer from './EthContainer'
import BtcContainer from './BtcContainer'
import LtcContainer from './LtcContainer'
import Leaderboard from '../components/Leaderboard'
import Totals from '../components/Totals';

let ethTotal, ltcTotal, btcTotal

class CryptoContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            txns: [],
            totals: {
            }
        }
        this.panes = [
            { menuItem: 'ETH', render: () => <Tab.Pane><EthContainer onTxChange={this.handleTxChange}/></Tab.Pane> },
            { menuItem: 'BTC', render: () => <Tab.Pane><BtcContainer onTxChange={this.handleTxChange}/></Tab.Pane> },
            { menuItem: 'LTC', render: () => <Tab.Pane><LtcContainer onTxChange={this.handleTxChange}/></Tab.Pane> },
        ]
    }

    // TODO: this will have to change to not replace the txns, 
    // but add to them and not duplicate
    handleTxChange = (currency, txns) => {
        
        if (currency === 'eth') {
            ethTotal = txns.reduce((acc, cur) => {
                return acc.add(cur.value);
            }, new Web3.utils.BN(0))
            ethTotal = parseFloat(ethTotal / 10**18).toFixed(2)
            let oldTotals = this.state.totals
            return this.setState({
                txns,
                totals: {
                    eth: ethTotal,
                    ...oldTotals
                }
            })
        } else if (currency === 'ltc') {
            ltcTotal = txns.reduce((acc, cur) => {
                return acc.add(cur.value)
            }, new Web3.utils.BN(0))
            ltcTotal = parseFloat(ltcTotal).toFixed(2)
            let oldTotals = this.state.totals
            this.setState({
                totals: {
                    ltc: ltcTotal,
                    ...oldTotals,
                }
            })
        } else if (currency === 'btc') {
            btcTotal = txns.reduce((acc, cur) => {
                return acc.add(cur.value)
            }, new Web3.utils.BN(0))
            btcTotal = parseFloat(btcTotal).toFixed(2)
            let oldTotals = this.state.totals
            this.setState({
                totals: {
                    btc: btcTotal,
                    ...oldTotals,
                }
            })
        }
    }

    render() {
        return <div>
            <hr />
            <Header as='h2'>Choose a currency to donate.</Header>
            <Tab menu={{ fluid: true, vertical: false, color:'orange', inverted: true}} panes={this.panes}  />
            <Totals totals={this.state.totals} />
            <Leaderboard txns={this.state.txns} />
        </div>
    }
}

export default CryptoContainer