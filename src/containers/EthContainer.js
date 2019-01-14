import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import { css } from "glamor"
import Web3 from 'web3'
import { Grid, Button, Form, Header } from 'semantic-ui-react'

let ethContainerStyle = css({
    background: '#ffffffff',
})

let qrCodeStyle = css({
    padding: '1rem',
    width: '300',
    height: '300',
    justifySelf: 'end',
})

let formStyle = css({
    padding: '1rem',
})

const donationNetworkID = 1; // make sure donations only go through on this network.
// const donationAddress = "0x0Ab4d7d50f36A168EbA567b07BbB7D1Ad3372A86"; //replace with the address to watch
const donationAddress = "0x0Ab4d7d50f36A168EbA567b07BbB7D1Ad3372A86" //replace with the address to watch
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
        return this.props.onTxChange('eth', filteredEthList)
    }
    
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
                this.processEthList(res)
            }
        )})
    }

    handleDonate = event => {
        event.preventDefault();
        const form = event.target;
        let donateWei = new myweb3.utils.BN(
             myweb3.utils.toWei(form.elements["amount"].value, "ether")
        );
        let message = myweb3.utils.toHex(form.elements["message"].value);
        let extraGas = form.elements["message"].value.length * 68;
    
        myweb3.eth.net.getId().then(netId => {
            switch (netId) {
                case 1:
                    console.log("Metamask is on mainnet");
                    break;
                case 2:
                    console.log("Metamask is on the deprecated Morden test network.");
                    break;
                case 3:
                    console.log("Metamask is on the ropsten test network.");
                    break;
                case 4:
                    console.log("Metamask is on the Rinkeby test network.");
                    break;
                case 42:
                    console.log("Metamask is on the Kovan test network.");
                    break;
                default:
                    console.log("Metamask is on an unknown network.");
            }
            if (netId === donationNetworkID) {
                return myweb3.eth.getAccounts().then(accounts => {
                    return myweb3.eth
                        .sendTransaction({
                        from: accounts[0],
                        to: donationAddress,
                        value: donateWei,
                        gas: 150000 + extraGas,
                        data: message
                    })
                    .catch(e => {
                        console.log(e);
                     });
                });
            } else {
                console.log("no donation allowed on this network");
                this.setState({
                    donateenabled: false
                });
            }
        });
    };

    render() {
        return <div className={`${ethContainerStyle}`}>
            <Header as="h2">Ethereum</Header>
            <Grid divided='vertically'>
                <Grid.Row columns={2} className={`${ethContainerStyle}`}>
                <Grid.Column className={`${ethContainerStyle}`}>
                    <h4>Privately: Send directly to the donation address</h4>  
                    <QRCode
                        className={`${qrCodeStyle}`}
                        renderAs="svg"
                        fgColor="#000000"
                        bgColor="#89e5ff00"
                        value={donationAddress}
                    />
                    <h4>{donationAddress}</h4>
                </Grid.Column>
                <Grid.Column className={`${ethContainerStyle}`}>
                    <div className={`${ethContainerStyle}`}>
                        <h4 >
                            {`Publicly: Send a transaction via `}
                            <a href="https://metamask.io">Metamask</a>
                            {` with your name (or something else) as a message `} 
                        </h4>
                        <h4>All donations with the same address will be added together.</h4>
                        <Form  onSubmit={this.handleDonate} className={`${formStyle}`}>
                            <input
                                type="text"
                                placeholder="ETH to donate"
                                name="amount"
                            />
                            <input type="text" placeholder="message" name="message" />
                            <Button className="Button">Send</Button>
                        </Form>
                    </div>
                </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
      }
}

export default EthContainer