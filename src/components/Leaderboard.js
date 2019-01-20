import React, { Component } from 'react'
import Emojify from 'react-emojione'
import { Table, Header, Container } from 'semantic-ui-react'

class Leaderboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            txns: this.props.txns
        }
    }


    hex_to_ascii = (str1) => {
        var hex  = str1.toString();
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.txns !== this.props.txns) {
            this.setState({
                txns: this.props.txns
            })
        }
    }

    render() {
        let { txns } = this.props
        return (
            <Container fluid>
                <div>
                <hr />
                <Header as='h1'>Find yourself on the Leaderboard</Header>
                <Table color={'orange'} striped padded size={'small'}>
                    <Table.Header >
                        <Table.Row >
                            <Table.HeaderCell><Header as='h3'>Rank</Header></Table.HeaderCell>
                            <Table.HeaderCell><Header as='h3'>Address</Header></Table.HeaderCell>
                            <Table.HeaderCell><Header as='h3'>Value</Header></Table.HeaderCell>
                            {/* <Table.HeaderCell><Header as='h3'>USD</Header></Table.HeaderCell> */}
                            <Table.HeaderCell><Header as='h3'>Message</Header></Table.HeaderCell>
                            <Table.HeaderCell><Header as='h3'>Tx Link</Header></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {txns.map(item => (
                            <Table.Row key={item.from}>
                                <Table.Cell><Header as='h4'>{item.rank}</Header></Table.Cell>
                                <Table.Cell><Header as='h4'>{item.from}</Header></Table.Cell>
                                <Table.Cell><Header as='h4'>{`${parseFloat(item.value).toPrecision(3)} ${item.currency}`}</Header>
                                <Header as='h4'>{`${parseFloat(item.usd_value)} USD`}</Header></Table.Cell>
                                <Table.Cell>
                                    <Header as='h4'>
                                        <Emojify>
                                            {item.input.length &&
                                            this.hex_to_ascii(item.input)}
                                        </Emojify>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell>
                                    <Header as='h4'>        
                                        {item.hash.map((txHash, index) => (
                                            <a
                                            key={index}
                                            href={"https://etherscan.io/tx/" + txHash}
                                            >
                                            [{index + 1}]
                                            </a>
                                        ))}
                                    </Header>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                </div>
            </Container>
        )
    }
}

export default Leaderboard