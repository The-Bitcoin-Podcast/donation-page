import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import MakerUsdPrice from './MakerDaoUsd'
import CryptoPrice from './CryptoPrice'

class Totals extends Component {

    render() {
        const { eth, ltc, btc } = this.props.totals
        return (
            <Grid>
                <Grid.Column width={6}>
                    Total ETH: {eth}
                    <MakerUsdPrice amount={eth} />
                </Grid.Column>
                <Grid.Column width={4}>
                    Total BTC: {btc}
                    <CryptoPrice amount={btc} currency={'BTC'} />
                </Grid.Column>
                <Grid.Column width={6}>
                    Total LTC: {ltc}
                    <CryptoPrice amount={ltc} currency={'LTC'} />
                </Grid.Column>
            </Grid>
        )
    }

}

export default Totals