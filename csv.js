const csv = require('csv-parser')
const fs = require('fs')
const log = require('./log')
const { Transform } = require('stream');

class FixTransform extends Transform {
    // CSV lines include unescaped newlines in values...
    constructor() {
        super()
        log.info("Fixing CSV incorrect new lines")
    }

    _transform(chunk, enc, done) {
        const result = chunk.toString("utf8")
                            .replace(/\n(?!\d{1,2}\/\d{1,2}\/\d{4})/g, " ")
        this.push(result)
        done()
    }
}

function read(filename) {
    return new Promise(resolve => {
        log.info("Reading CSV file")
        const results = []
        const fixTransform = new FixTransform()
        const csvTransform = csv(['date',
                       'description',
                       'cardMember',
                       'accountNumber',
                       'amount',
                       'extendedDetails',
                       'appearsOnYourStatementAs',
                       'address',
                       'townOrCity',
                       'postcode',
                       'country',
                       'reference'])
        fixTransform.on('end', () => {
            log.info("Parsing CSV")
        })
        csvTransform.on('data', (data) => results.push(data))
        csvTransform.on('end', () => resolve(results.slice(1)))
        fs.createReadStream(filename)
            .pipe(fixTransform)
            .pipe(csvTransform);
    })
}

module.exports = { read }
