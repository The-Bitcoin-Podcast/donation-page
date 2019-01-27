import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import { css } from "glamor"
import { Header } from 'semantic-ui-react';

let ltcContainerStyle = css({
    background: '#ffffffff',
})

let qrCodeStyle = css({
    padding: '1rem',
    width: '300',
    height: '300',
    justifySelf: 'end',
})

const donationDisplay = "MGbRJcpJEJMAFXstTVmWx2JCrt2L4EKAEx"
const donationAddress = "3APGzjQLHBVjT2bzMcnB8P3oYBRt2EHgbj"; //replace with the address to watch
const blockcypherApiLinks = {
    txns: "https://api.blockcypher.com/v1/ltc/main/addrs/" + donationAddress
}



class LtcContainer extends Component {
    state = {
        ltcList: []
    }

    getAccountData = () => {
        let fetchCalls = [
            // fetch(`${blockcypherApiLinks.txns}`, {'mode': 'no-cors'}),
            fetch(`${blockcypherApiLinks.txns}`),
        ];
        return Promise.all(fetchCalls)
            .then(res => {
                return Promise.all(res.map(apiCall => apiCall.json()));
            })
            .then(responseJson => {
                return responseJson[0].txrefs ? [].concat.apply(responseJson[0].txrefs) : []
            })
    };

    processLtcList = (txns) => {
        // Create list of Urls based on tx_hashes
        
        let filteredLtcList = txns.map(
            obj => {
                obj.input = '0x'
                return obj
            })
            .reduce((acc, cur) => {
                // group by address and sum tx value
                if (typeof acc[cur.tx_hash] === "undefined") {
                    acc[cur.tx_hash] = {
                        from: "Don't know, LTC blockexplorers suck",
                        value: 0,
                        input: cur.input,
                        hash: [],
                        currency: 'LTC'
                    };
                }
                acc[cur.tx_hash].value = parseFloat(cur.value  / 10**8)
                acc[cur.tx_hash].input =
                    cur.input !== "0x" && cur.input !== "0x00"
                        ? cur.input
                        : acc[cur.tx_hash].input;
                acc[cur.tx_hash].hash.push(cur.tx_hash);
                return acc;
            }, {});
        filteredLtcList = Object.keys(filteredLtcList)
            .map(val => filteredLtcList[val])
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
                value={donationDisplay}
            />
            <Header as='h4'>{donationDisplay}</Header>

        </div>
      }
}

export default LtcContainer