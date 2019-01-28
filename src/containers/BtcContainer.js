import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import { css } from "glamor"
import { Header } from 'semantic-ui-react';
import Axios from 'axios';

let btcContainerStyle = css({
    background: '#ffffffff',
})

let qrCodeStyle = css({
    padding: '1rem',
    width: '300',
    height: '300',
    justifySelf: 'end',
})

const donationAddress = process.env.REACT_APP_BTC_ADDRESS 
const apiLinks = {
    blockcypher: "https://api.blockcypher.com/v1/btc/main/addrs/" + donationAddress,
    btccom: `https://chain.api.btc.com/v3/address/${donationAddress}/tx`,
}

class BtcContainer extends Component {
    state = {
        btcList: []
    }

    getAccountData = () => {
        let fetchCalls = [
            // fetch(`${apiLinks.blockcypher}`, {'mode': 'no-cors'}),
            Axios.get(`${apiLinks.btccom}`),
        ];
        return Promise.all(fetchCalls)
            .then(responseJson => {
                return responseJson[0].data.data.list ? [].concat.apply(responseJson[0].data.data.list) : []
            })
    };

    processBtcComList = (txns) => {
        // Create list of Urls based on tx_hashes
        let filteredBtcList = txns.map(
            obj => {
                obj.input = '0x'
                return obj
            })
            .reduce((acc, cur) => {
                // group by address and sum tx value
                if (typeof acc[cur.hash] === "undefined") {
                    acc[cur.hash] = {
                        from: cur.inputs[0].prev_addresses[0],
                        value: 0,
                        input: cur.input,
                        hash: [],
                        currency: 'BTC'
                    };
                }
                acc[cur.hash].value = parseFloat(cur.outputs_value / 10**8)
                acc[cur.hash].input =
                    cur.input !== "0x" && cur.input !== "0x00"
                        ? cur.input
                        : acc[cur.hash].input;
                acc[cur.hash].hash.push(cur.hash);
                return acc;
            }, {});
        filteredBtcList = Object.keys(filteredBtcList)
            .map(val => filteredBtcList[val])
        return this.props.onTxChange('btc', filteredBtcList)
    }

    componentDidMount = () => {
        this.getAccountData().then(res => {
            this.setState(
            {
                transactionsArray: res
            },
            () => {
                // this.processBtcList(res)
                this.processBtcComList(res)
            }
        )})
    }

    render() {
        return <div className={`${btcContainerStyle}`}>
            <Header as="h2">Bitcoin</Header>
            <h4>Privately: Send directly to the donation address</h4>
            <QRCode
                className={`${qrCodeStyle}`}
                renderAs="svg"
                fgColor="#000000"
                bgColor="#89e5ff00"
                value={donationAddress}
            />
            <h4>{donationAddress}</h4>

        </div>
      }
}

export default BtcContainer