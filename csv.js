const csv = require('csv-parser')
const fs = require('fs')

function read(filename) {
    return new Promise(resolve => {
        console.log("Parsing csv file")
        const results = []
        fs.createReadStream(filename)
            .pipe(csv(['transactionDate', 'reference', 'amount', 'counterPartyName', 'info', 'unused']))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results)
            });
    })
}

module.exports = { read }
