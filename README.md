# TERNETZI

NodeJS script to scrape the american express website for transactions and store them in Postgres.

## Requirements

NodeJS (v14.2.0)
Postgres (v11.5)

## Development usage

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

## Run as cron job

Run `npm link`.

Set the environment variables in the cron job executable file (`ternetzi_cron`).

Symlink it:
```
sudo ln -s $(pwd)/ternetzi_cron /usr/local/bin/ternetzi_cron
```

Add something like this to the crontab (`crontab -e`):
```
# m    h dom mon dow   command
  0,30 * *   *   *     /usr/local/bin/ternetzi_cron
```
