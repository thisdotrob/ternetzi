const { Client } = require('pg')
const client = new Client()

async function connect() {
    await client.connect()
}

const sqlQuery = `
INSERT INTO amex_transactions (
    date,
    description,
    card_member,
    account_number,
    amount,
    extended_details,
    appears_on_your_statement_as,
    address,
    town_or_city,
    postcode,
    country,
    reference
) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12
) ON CONFLICT (
    reference
) DO UPDATE SET
    date = $1,
    description = $2,
    card_member = $3,
    account_number = $4,
    amount = $5,
    extended_details = $6,
    appears_on_your_statement_as = $7,
    address = $8,
    town_or_city = $9,
    postcode = $10,
    country = $11
`

function insert(row) {
    return client.query(sqlQuery, [
        row.date,
        row.description,
        row.cardMember,
        row.accountNumber,
        row.amount,
        row.extendedDetails,
        row.appearsOnYourStatementAs,
        row.address,
        row.townOrCity,
        row.postcode,
        row.country,
        row.reference
    ])
}

async function end() {
    await client.end()
}

module.exports = { connect, insert, end }
