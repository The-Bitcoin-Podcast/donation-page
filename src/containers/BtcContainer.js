import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import { css } from "glamor"
import { Header } from 'semantic-ui-react';
import Web3 from 'web3'

let btcContainerStyle = css({
    background: '#ffffffff',
})

let qrCodeStyle = css({
    padding: '1rem',
    width: '300',
    height: '300',
    justifySelf: 'end',
})

const donationAddress = "1DzakJiMj9cTkQiujPjC5KJkCGUdvsWJEP"; //replace with the address to watch
const blockcypherApiLinks = {
    txns: "https://api.blockcypher.com/v1/btc/main/addrs/" + donationAddress
}

class BtcContainer extends Component {
    state = {
        btcList: []
    }

    getAccountData = () => {
        let fetchCalls = [
            fetch(`${blockcypherApiLinks.txns}`),
        ];
        return Promise.all(fetchCalls)
            .then(res => {
                return Promise.all(res.map(apiCall => apiCall.json()));
            })
            .then(responseJson => {
                return [].concat.apply(responseJson[0].txrefs)
            });
    };

    processBtcList = (txns) => {
        // Create list of Urls based on tx_hashes
        
        let filteredBtcList = txns.map(
            obj => {
                obj.input = ''
                obj.value = new Web3.utils.BN(obj.value / 10**8)
                return obj
            })
            .reduce((acc, cur) => {
                // group by address and sum tx value
                // console.log(`acc: `, acc, ` cur: `, cur)
                if (typeof acc[cur.tx_hash] === "undefined") {
                    acc[cur.tx_hash] = {
                        from: "who knows",
                        value: new Web3.utils.BN(0),
                        input: cur.input,
                        tx_hash: []
                    };
                }
                acc[cur.tx_hash].value = cur.value.add(acc[cur.tx_hash].value)
                acc[cur.tx_hash].input =
                    cur.input !== "0x" && cur.input !== "0x00"
                        ? cur.input
                        : acc[cur.tx_hash].input;
                acc[cur.tx_hash].tx_hash.push(cur.tx_hash);
                return acc;
            }, {});
        filteredBtcList = Object.keys(filteredBtcList)
            .map(val => filteredBtcList[val])
            .sort((a, b) => {
                // sort greatest to least
                return b.value.cmp(a.value);
        })
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
                this.processBtcList(res)
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