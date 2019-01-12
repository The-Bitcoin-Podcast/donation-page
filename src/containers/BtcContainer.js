import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import { css } from "glamor"

let btcContainerStyle = css({
    background: '#ffffffff',
})

let qrCodeStyle = css({
    padding: '1rem',
    width: '300',
    height: '300',
    justifySelf: 'end',
})

const donationAddress = "1DzakJiMj9cTkQiujPjC5KJkCGUdvsWJEP"; //replace with the address to watch

class BtcContainer extends Component {


    render() {
        return <div className={`${btcContainerStyle}`}>
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

export default BtcContainer