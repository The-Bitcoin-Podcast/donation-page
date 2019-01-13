import React, { Component } from 'react'
import Emojify from 'react-emojione'
import { Table, Header } from 'semantic-ui-react'
import _ from 'lodash'

class Leaderboard extends Component {
    state = {
        column: null,
        direction: null
    }

    hex_to_ascii = (str1) => {
        var hex  = str1.toString();
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;
    }

    handleSort = clickedColumn => () => {
        const { column, data, direction } = this.state
    
        if (column !== clickedColumn) {
          this.setState({
            column: clickedColumn,
            data: _.sortBy(data, [clickedColumn]),
            direction: 'ascending',
          })
    
          return
        }
    
        this.setState({
          data: data.reverse(),
          direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    render() {
        const { column, direction } = this.state
        return (
            <div>
                <hr />
                <Header as='h2'>Find yourself on the Leaderboard</Header>
                <Table size='small' sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell
                                sorted={column === 'rank' ? direction : null}
                                onClick={this.handleSort('rank')}
                            >Rank</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'from' ? direction : null}
                                onClick={this.handleSort('from')}
                            >Address</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'value' ? direction : null}
                                onClick={this.handleSort('value')}
                            >Value</Table.HeaderCell>
                            <Table.HeaderCell>Message</Table.HeaderCell>
                            <Table.HeaderCell>Tx Link</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.props.txns.map(item => (
                            <Table.Row>
                                <Table.Cell>{item.rank}</Table.Cell>
                                <Table.Cell>{item.from}</Table.Cell>
                                <Table.Cell>{item.value / 10**18} ETH</Table.Cell>
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
                </ Table>
            </div>
        )
    }
}

export default Leaderboard