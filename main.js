const fs = require("fs");
const amex = require("./amex");
const csv = require("./csv");
const transforms = require("./transforms");
const db = require("./db");

const main = async () => {
    await amex.scrape()
    const csvRows = await csv.read("/tmp/ofx.csv")
    console.log("Converting csv rows to db rows")
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
    console.log("Removing temporary file...");
    fs.unlinkSync("/tmp/ofx.csv");
};

main()
  .then(() => {
    console.log("Finished!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
