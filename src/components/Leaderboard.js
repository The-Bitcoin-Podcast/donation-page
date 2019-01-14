import React, { Component } from 'react'
import Emojify from 'react-emojione'
import { Table, Header, Container } from 'semantic-ui-react'

class Leaderboard extends Component {

    hex_to_ascii = (str1) => {
        var hex  = str1.toString();
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;
    }

    render() {
        let { txns } = this.props
        return (
            <Container fluid>
                <div>
                <hr />
                <Header as='h2'>Find yourself on the Leaderboard</Header>
                <Table color={'orange'} striped padded size={'small'}>
                    <Table.Header >
                        <Table.Row >
                            <Table.HeaderCell>Rank</Table.HeaderCell>
                            <Table.HeaderCell>Address</Table.HeaderCell>
                            <Table.HeaderCell>Value</Table.HeaderCell>
                            <Table.HeaderCell>Message</Table.HeaderCell>
                            <Table.HeaderCell>Tx Link</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {txns.map(item => (
                            <Table.Row key={item.from}>
                                <Table.Cell><p>{item.rank}</p></Table.Cell>
                                <Table.Cell><p>{item.from}</p></Table.Cell>
                                <Table.Cell>{parseFloat(item.value / 10**18).toPrecision(4)} ETH</Table.Cell>
                                <Table.Cell>
                                    <Emojify>
                                        {item.input.length &&
                                        // myweb3.utils.hexToAscii(item.input)}
                                        this.hex_to_ascii(item.input)}
                                    </Emojify>
                                </Table.Cell>
                                <Table.Cell>
                                    {item.hash.map((txHash, index) => (
                                        <a
                                        key={index}
                                        href={"https://etherscan.io/tx/" + txHash}
                                        >
                                        [{index + 1}]
                                        </a>
                                    ))}
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