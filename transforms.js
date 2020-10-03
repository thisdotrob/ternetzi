function date(row) {
    // '17/09/2019' -> '2019-09-17'
    const split = row.date.split('/')
    return [split[2], split[1], split[0]].join('-')
}

function description(row) {
    return row.description.substr(0, 23).trim() + " (" + row.description.substr(24) + ")" 
}

function amount(row) {
    // ' -57.01' -> -5701
    return parseInt(parseFloat(row.amount) * 100)
}

function reference(row) {
    // "'AT202760034000010380453'" ->  "AT202760034000010380453"
    return row.reference.substr(1, row.reference.length - 2)
}

module.exports = {
    date,
    description,
    amount,
    reference,
}
