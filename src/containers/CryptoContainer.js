import React, { Component } from 'react'
import { Tab, Header } from 'semantic-ui-react'
import EthContainer from './EthContainer'
import BtcContainer from './BtcContainer'
import LtcContainer from './LtcContainer'
import Leaderboard from '../components/Leaderboard'
import Totals from '../components/Totals';
import Axios from 'axios';

let ethTotal, ltcTotal, btcTotal

const coinsApiBase = 'https://api.cryptonator.com/api/ticker/'
const coinsApiLinks = {
    eth: `${coinsApiBase}eth-usd`,
    ltc: `${coinsApiBase}ltc-usd`,
    btc: `${coinsApiBase}btc-usd`,
}

class CryptoContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            txns: [],
            totals: {},
            prices: {},
            gettingData: true,
        }
        this.handleReindex = this.handleReindex.bind(this)
    }

    getCoinPrices = () => {
        let fetchCalls = [
            Axios.get(`${coinsApiLinks.btc}`),
            Axios.get(`${coinsApiLinks.eth}`),
            Axios.get(`${coinsApiLinks.ltc}`),
        ];
        Promise.all(fetchCalls)
            .then(responseJson => {
                const bases = responseJson.map(x => x.data.ticker.base)
                const prices = responseJson.map(x => x.data.ticker.price)
                const baseprices = bases.reduce((o, k, i) => ({...o, [k]: prices[i]}), {})
                this.setState({
                    prices: {
                        ...baseprices,
                    },
                    gettingData: false,
                })
            });
    };

    handleReindex = (txns) => {
        const new_txns = Object.keys(txns)
            .map(val => txns[val])
            .sort((a, b) => {
                // sort greatest to least
                return b.usd_value - a.usd_value
        })
        .map((obj, index) => {
            // add rank
            obj.rank = index + 1;
            return obj;
        });
        return this.setState({
            txns: new_txns
        })
    }

    // TODO: this will have to change to not replace the txns, 
    // but add to them and not duplicate
    handleTxChange = (currency, txns) => {
        if (currency === 'eth') {
            let ethTxns = txns.map(obj => {
                obj.usd_value = parseFloat(parseFloat(this.state.prices.ETH) * parseFloat(obj.value)).toFixed(2)
                return obj
            })
            ethTotal = txns.reduce((acc, cur) => {
                return acc + cur.value;
            }, 0)
            ethTotal = parseFloat(ethTotal).toFixed(2)
            let oldTotals = this.state.totals
            let oldTxns = this.state.txns
            this.setState({
                txns: [
                    ...ethTxns,
                    ...oldTxns
                ],
                totals: {
                    eth: ethTotal,
                    ...oldTotals
                }
            })
            this.handleReindex([
                ...ethTxns,
                ...oldTxns
            ])
        } else if (currency === 'ltc') {
            let ltcTxns = txns.map(obj => {
                obj.usd_value = parseFloat(parseFloat(this.state.prices.LTC) * parseFloat(obj.value)).toFixed(2)
                return obj
            })
            ltcTotal = txns.reduce((acc, cur) => {
                return acc + cur.value
            }, 0)
            ltcTotal = parseFloat(ltcTotal).toFixed(2)
            let oldTotals = this.state.totals
            let oldTxns = this.state.txns
            this.setState({
                txns: [
                    ...ltcTxns,
                    ...oldTxns
                ],
                totals: {
                    ltc: ltcTotal,
                    ...oldTotals,
                }
            })
            this.handleReindex([
                ...ltcTxns,
                ...oldTxns
            ])
        } else if (currency === 'btc') {
            let btcTxns = txns.map(obj => {
                obj.usd_value = parseFloat(parseFloat(this.state.prices.BTC) * parseFloat(obj.value)).toFixed(2)
                return obj
            })
            btcTotal = txns.reduce((acc, cur) => {
                return acc + cur.value
            }, 0)
            btcTotal = parseFloat(btcTotal).toFixed(5)
            let oldTotals = this.state.totals
            let oldTxns = this.state.txns
            this.setState({
                txns: [
                    ...btcTxns,
                    ...oldTxns,
                ],
                totals: {
                    btc: btcTotal,
                    ...oldTotals,
                },
            })
            this.handleReindex([
                ...btcTxns,
                ...oldTxns
            ])
        }

    }

    componentWillMount = async () => {
        await this.getCoinPrices()
    }

    render() {
        if (this.state.gettingData) {
            return <Header as='h2'>Retrieving Data...</Header>
        }
        let panes = [
            { menuItem: 'ETH', pane: {
                active: true, 
                content: <EthContainer onTxChange={this.handleTxChange} />, key: 1 }},
            { menuItem: 'BTC', pane: {
                content: <BtcContainer onTxChange={this.handleTxChange} />, key: 2 }},
            { menuItem: 'LTC', pane: {
                content: <LtcContainer onTxChange={this.handleTxChange} />, key: 3 }},
        ]
        return <div>
            <hr />
            <Totals totals={this.state.totals} prices={this.state.prices} />
            <hr />
            <Header as='h2'>Choose a currency to donate.</Header>
            <Tab menu={{ fluid: true, vertical: false, color:'orange', inverted: true}} panes={panes} renderActiveOnly={false} />
            <Leaderboard txns={this.state.txns} />
        </div>
    }
}

export default CryptoContainer