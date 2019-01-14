import React, { Component } from 'react'

// TODO: put this into a env file
const APIkey = "90f17197139f7561f860ed3c725e2b3bb6d4f9e42fa6f01495d48cb50e536c8f"

// wants props:
//   currency
//   amount
class CryptoPrice extends Component {
    state = {
        price_usd: 0,
    }

    componentDidMount = () => {
        let { currency } = this.props
        fetch(`https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=USD&api_key=${APIkey}`)
        .then(res => res.json())
        .then(resJson => {
            return this.setState({
                price_usd: resJson.USD,
            })
        })
    }

    render() {
        return (
            <p>{parseFloat(this.state.price_usd) * parseFloat(this.props.amount)} USD</p>
        )
    }
}

export default CryptoPrice