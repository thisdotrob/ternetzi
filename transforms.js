function transactionDate(row) {
    // '17/09/2019' -> '2019-09-17'
    const split = row.transactionDate.split('/')
    return [split[2], split[1], split[0]].join('-')
}

function reference(row) {
    // 'Reference: AT192610037000010561046' -> 'AT192610037000010561046'
    return row.reference.substr(10)
}

function minorUnits(row) {
    // ' -57.01' -> -5701
    return (parseFloat(row.amount) * 1000) / 10
}

function counterPartyName(row) {
    return row.counterPartyName
}

function processDate(row) {
    // 'DATACASH DATACASH Process Date 15/09/2019  DATACASH DATACASH' -> '2019-09-15'
    const dateStr = row.info.match(/Process Date ([0-9]{2}\/[0-9]{2}\/[0-9]{4})/)[1]
    const split = dateStr.split('/')
    return [split[2], split[1], split[0]].join('-')
}

function description(row) {
    // 'DATACASH DATACASH Process Date 15/09/2019  DATACASH DATACASH' -> 'DATACASH DATACASH DATACASH DATACASH'
    return row.info.replace(/ Process Date [0-9]{2}\/[0-9]{2}\/[0-9]{4} /, '')
}

module.exports = {
    transactionDate,
    reference,
    minorUnits,
    counterPartyName,
    processDate,
    description,
}
