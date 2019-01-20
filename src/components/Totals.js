import React, { Component } from 'react'
import { Grid, Header, Segment } from 'semantic-ui-react'

class Totals extends Component {

    render() {
        const { eth, ltc, btc } = this.props.totals
        const { ETH, LTC, BTC } = this.props.prices
        return (
            <div>
            <Segment inverted color='orange' textAlign='center'><Header as='h2'>Amounts Donated</Header></Segment>
            <Grid>
                <Grid.Column width={6}>
                    <Header as='h2'>
                        Total ETH: {eth}
                    </Header>
                    <Header as='h2'>
                        {parseFloat(ETH * eth).toFixed(2)} USD
                    </Header>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Header as='h2'>
                        Total BTC: {btc}
                    </Header>
                    <Header as='h2'>
                        {parseFloat(BTC * btc).toFixed(2)} USD
                    </Header>
                </Grid.Column>
                <Grid.Column width={6}>
                    <Header as='h2'>
                        Total LTC: {ltc}
                    </Header>
                    <Header as='h2'>
                        {parseFloat(LTC * ltc).toFixed(2)} USD
                    </Header>
                </Grid.Column>
            </Grid>
            </div>
        )
    }
}

export default Totals