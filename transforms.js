function transactionDate(row) {
    // 'Feb 1'  -> '2020-02-01'
    // 'Jan 29' -> '2020-01-29'
    const split = row.transactionDate.split(' ')
    const months = {Jan: '01', Feb: '02'}
    const month = months[split[0]]
    const day = ("0" + split[1]).substr(-2)
    return ['2020', month, day].join('-')
}

let startRef = 100000000000000

function reference(row) {
    // Auto incrementing string
    const ref = "MANENTRY" + startRef
    startRef += 1
    return ref
}

function minorUnits(row) {
    // '-57.01' -> -5701
    return parseInt(parseFloat(row.amount) * 100)
}

function counterPartyName(row) {
    return row.counterPartyName
}

function processDate(row) {
    // 'Feb 1'  -> '2020-02-01'
    // 'Jan 29' -> '2020-01-29'
    const split = row.processDate.split(' ')
    const months = {Jan: '01', Feb: '02'}
    const month = months[split[0]]
    const day = ("0" + split[1]).substr(-2)
    return ['2020', month, day].join('-')
}

function description(row) {
    return null;
}

module.exports = {
    transactionDate,
    reference,
    minorUnits,
    counterPartyName,
    processDate,
    description,
}
