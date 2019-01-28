# Cryptocurrency Donation Page Webapp

This is a relatively simple webapp that allows for people to put up a cryptocurrency enabled donation page.

Donation accounts for various coins are hard-coded at build time

All donations from various coins are collected, their USD-price checked via public API, and put into a leaderboard where they are ranked against each other.  Ethereum donations have the additional option to insert a message which is also displayed into the leaderbaord

Everything is done client side, no servers involved. 

## To install

`yarn install`

## To start

`yarn start`

## To build

`npm run build`

TODO:  

- [ ] Find a better LTC block explorer to extract `from` address (first input UTXO address)
- [ ] Set up config file for easy deployment and configuration
- [ ] More general web3 compatibility (Status / MIST / MyCrypto / etc)
- [ ] Style overhaul ( includig mobile view )
- [x] Switch from `fetch` to `axios.get`
- [ ] use [WatermelonDB](https://github.com/Nozbe/WatermelonDB)
- [ ] implemented leaderboard change alerting
- [ ] add lightning node to BTC section
- [ ] add config setup to readme