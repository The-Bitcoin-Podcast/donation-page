import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import { css } from "glamor"

let ltcContainerStyle = css({
    background: '#ffffffff',
})

let qrCodeStyle = css({
    padding: '1rem',
    width: '300',
    height: '300',
    justifySelf: 'end',
})

const donationAddress = "LSrAehXcciL7PhgaeiykK9pW7cqMHLUh9N"; //replace with the address to watch



class LtcContainer extends Component {


    render() {
        return <div className={`${ltcContainerStyle}`}>
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

export default LtcContainer