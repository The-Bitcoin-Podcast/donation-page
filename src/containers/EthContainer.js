import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import { css } from "glamor"
import Web3 from 'web3'

let ethContainerStyle = css({
    background: '#ffffffff',
})

let qrCodeStyle = css({
    padding: '1rem',
    width: '300',
    height: '300',
    justifySelf: 'end',
})

const donationAddress = "0x0Ab4d7d50f36A168EbA567b07BbB7D1Ad3372A86"; //replace with the address to watch
const apiKey = "SC1H6JHAK19WC1D3BGV3JWIFD983E7BS58"; //replace with your own key
let myweb3

const etherscanApiLinks = {
  extTx:
    "https://api.etherscan.io/api?module=account&action=txlistinternal&address=" +
    donationAddress +
    "&startblock=0&endblock=99999999&sort=asc&apikey=" +
    apiKey,
  intTx:
    "https://api.etherscan.io/api?module=account&action=txlist&address=" +
    donationAddress +
    "&startblock=0&endblock=99999999&sort=asc&apikey=" +
    apiKey
};

class EthContainer extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            ethlist: [],
            searchTerm: "",
            donateenabled: true,
            socketconnected: false,
            totalAmount: 0
        };
    }

    getAccountData = () => {
        let fetchCalls = [
            fetch(`${etherscanApiLinks.extTx}`),
            fetch(`${etherscanApiLinks.intTx}`)
        ];
        return Promise.all(fetchCalls)
            .then(res => {
                return Promise.all(res.map(apiCall => apiCall.json()));
            })
            .then(responseJson => {
                return [].concat.apply(...responseJson.map(res => res.result));
            });
    };

    processEthList = ethlist => {
        // let totalAmount = new myweb3.utils.BN(0);
        let filteredEthList = ethlist
            .map(obj => {
                obj.value = new myweb3.utils.BN(obj.value); // convert string to BigNumber
                return obj;
            })
        // .filter(obj => {
        //   return obj.value.cmp(new myweb3.utils.BN(0));
        // }) // filter out zero-value transactions
        .reduce((acc, cur) => {
            // group by address and sum tx value
            if (cur.isError !== "0") {
                // tx was not successful - skip it.
                return acc;
            }
            if (cur.from === donationAddress.toLowerCase()) {
                // tx was outgoing - don't add it in
                return acc;
            }
            if (typeof acc[cur.from] === "undefined") {
                acc[cur.from] = {
                    from: cur.from,
                    value: new myweb3.utils.BN(0),
                    input: cur.input,
                    hash: []
                };
            }
            acc[cur.from].value = cur.value.add(acc[cur.from].value);
            acc[cur.from].input =
                cur.input !== "0x" && cur.input !== "0x00"
                    ? cur.input
                    : acc[cur.from].input;
            acc[cur.from].hash.push(cur.hash);
            return acc;
        }, {});
        filteredEthList = Object.keys(filteredEthList)
            .map(val => filteredEthList[val])
            .sort((a, b) => {
                // sort greatest to least
                return b.value.cmp(a.value);
        })
        .map((obj, index) => {
            // add rank
            obj.rank = index + 1;
            return obj;
        });
        const ethTotal = filteredEthList.reduce((acc, cur) => {
              return acc.add(cur.value);
        }, new myweb3.utils.BN(0));
        return this.setState({
            ethlist: filteredEthList,
            totalAmount: parseFloat(myweb3.utils.fromWei(ethTotal)).toFixed(2)
        });
    };
    
    componentDidMount = () => {
        if (
            typeof window.web3 !== "undefined" &&
            typeof window.web3.currentProvider !== "undefined"
        ) {
            myweb3 = new Web3(window.web3.currentProvider);
            myweb3.eth.defaultAccount = window.web3.eth.defaultAccount;
            this.setState({
            candonate: true
            });
        } else {
            // I cannot do transactions now.
            this.setState({
            candonate: false
            });
            myweb3 = new Web3();
        }

        this.getAccountData().then(res => {
            this.setState(
            {
                transactionsArray: res
            },
            () => {
                this.processEthList(res);
            }
            );

        })
    };

    render() {
        return <div className={`${ethContainerStyle}`}>
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

export default EthContainer