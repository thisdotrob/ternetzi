#!/usr/bin/env node

const path = require("path");
const amex = require("./amex");
const csv = require("./csv");
const transforms = require("./transforms");
const db = require("./db");
const log = require("./log");

const notRepayment = r => r.description !== "PAYMENT RECEIVED - THANK YOU"

const main = async () => {
    await amex.scrape()
    const csvRows = await csv.read(path.resolve(__dirname, "download", "activity.csv"))
    const dbRows = csvRows.filter(notRepayment).map(r => ({
        ...r,
        date: transforms.date(r),
        description: transforms.description(r),
        amount: transforms.amount(r),
        reference: transforms.reference(r),
    }))
    log.info("Connecting to DB")
    await db.connect()
    log.info("Inserting DB rows")
    await Promise.all(dbRows.map(db.insert))
    await db.end()
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
