const { Client } = require('pg')
const client = new Client()

async function connect() {
    await client.connect()
}

const sqlQuery = `
INSERT INTO amex_transactions (
    reference,
    transaction_date,
    process_date,
    minor_units,
    counter_party_name,
    description
) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
) ON CONFLICT (
    reference
) DO UPDATE SET
    transaction_date = $2,
    process_date = $3,
    minor_units = $4,
    counter_party_name = $5,
    description = $6
`

function insert(row) {
    return client.query(sqlQuery, [
        row.reference,
        row.transactionDate,
        row.processDate,
        row.minorUnits,
        row.counterPartyName,
        row.description,
    ])
}

async function end() {
    await client.end()
}

module.exports = { connect, insert, end }
