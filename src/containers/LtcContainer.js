import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import { css } from "glamor"
import { Header } from 'semantic-ui-react';
import Web3 from 'web3'

let ltcContainerStyle = css({
    background: '#ffffffff',
})

let qrCodeStyle = css({
    padding: '1rem',
    width: '300',
    height: '300',
    justifySelf: 'end',
})

const donationAddress = "LSrAehXcciL7PhgaeiykK9pW7cqMHLUh9N"; //replace with the address to watch
const blockcypherApiLinks = {
    txns: "https://api.blockcypher.com/v1/ltc/main/addrs/" + donationAddress
}



class LtcContainer extends Component {
    state = {
        ltcList: []
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

    processLtcList = (txns) => {
        // Create list of Urls based on tx_hashes
        
        let filteredLtcList = txns.map(
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
        filteredLtcList = Object.keys(filteredLtcList)
            .map(val => filteredLtcList[val])
            .sort((a, b) => {
                // sort greatest to least
                return b.value.cmp(a.value);
        })
        .map((obj, index) => {
            // add rank
            obj.rank = index + 1;
            return obj;
        });
        return this.props.onTxChange('ltc', filteredLtcList)
    }

    componentDidMount = () => {
        this.getAccountData().then(res => {
            this.setState(
            {
                transactionsArray: res
            },
            () => {
                this.processLtcList(res)
            }
        )})
    }

    render() {
        return <div className={`${ltcContainerStyle}`}>
            <Header as='h2'>Litecoin</Header>
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

export default LtcContainer