# TERNETZI

NodeJS script to scrape the american express website for transactions and store them in Postgres.

## Requirements

NodeJS (v13.13.0) <-- the 'pg' package seems to be broken for v14, see note below
Postgres (v11.5)

## Usage

Install the dependencies with `npm i`.

Set the following environment variables:
```
AMEX_USERNAME
AMEX_PASSWORD
PGUSER
PGHOST
PGPASSWORD
PGDATABASE
PGPORT
```

Run the script with `node main.js`.

## pg package not working on Node v14.0.0+
The connect promise in the following snippet never resolves or rejects on this version of node:
```
Welcome to Node.js v14.2.0.
Type ".help" for more information.
> const { Client } = require('pg')
undefined
> const client = new Client()
undefined
> client.connect().then(() => console.log('connected')) .catch(err => console.error('connection error', err.stack))
Promise { <pending> }
>
```

It works fine on v13.13.0:
```
Welcome to Node.js v13.13.0.
Type ".help" for more information.
> const { Client } = require('pg')
undefined
> const client = new Client()
undefined
> client.connect().then(() => console.log('connected')) .catch(err => console.error('connection error', err.stack))
Promise { <pending> }
> connected
```
