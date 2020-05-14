#!/usr/bin/env node

const fs = require("fs");
const amex = require("./amex");
const csv = require("./csv");
const transforms = require("./transforms");
const db = require("./db");
const log = require("./log");

const main = async () => {
    log.info("Starting scrape")
    await amex.scrape()
    const csvRows = await csv.read("/tmp/ofx.csv")
    log.info("Converting csv rows to db rows")
    const dbRows = csvRows.map(r => ({
        reference: transforms.reference(r),
        transactionDate: transforms.transactionDate(r),
        processDate: transforms.processDate(r),
        minorUnits: transforms.minorUnits(r),
        counterPartyName: transforms.counterPartyName(r),
        description: transforms.description(r),
    }))
    await db.connect()
    await Promise.all(dbRows.map(db.insert))
    await db.end()
    log.info("Removing temporary file...");
    fs.unlinkSync("/tmp/ofx.csv");
};

main()
  .then(() => {
    log.info("Finished!");
    process.exit(0);
  })
  .catch(err => {
    log.error(err);
    process.exit(1);
  });
