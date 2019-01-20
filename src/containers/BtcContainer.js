import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import { css } from "glamor"
import { Header } from 'semantic-ui-react';

let btcContainerStyle = css({
    background: '#ffffffff',
})

let qrCodeStyle = css({
    padding: '1rem',
    width: '300',
    height: '300',
    justifySelf: 'end',
})

const donationAddress = "3E4vFyDB4wCSoRfbqwNvKoNXw3ADKbBxBX"; //replace with the address to watch
// const donationAddress = "3CxLwST9RZY4NXTAarNjgoTtoD8tR3cKxv"; //replace with the address to watch
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
            fetch(`${apiLinks.btccom}`),
        ];
        return Promise.all(fetchCalls)
            .then(res => {
                return Promise.all(res.map(apiCall => apiCall.json()));
            })
            .then(responseJson => {
                return responseJson[0].data.list ? [].concat.apply(responseJson[0].data.list) : []
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
        .map((obj, index) => {
            // add rank
            obj.rank = index + 1;
            return obj;
        });
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