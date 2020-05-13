# TERNETZI

NodeJS script to scrape the american express website for transactions and store them in Postgres.

## Requirements

NodeJS (v14.2.0)
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
