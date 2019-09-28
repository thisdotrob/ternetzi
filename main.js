const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
  let screenshotCounter = 0;
  console.log("Opening browser...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const screenshot = async tag => {
    await page.screenshot({path: 'screenshot-' + tag + '.png'});
  };

  console.log("Visiting amex homepage...");
  await Promise.all([
    page.waitForNavigation(),
    page.goto("https://global.americanexpress.com/login?inav=iNavLnkLog")
  ]);
  await screenshot("00");

  console.log("Clicking away euc mask...");
  await page.waitForSelector("#euc_mask", { visible: true })
  await screenshot("01");
  await page.click("#euc_mask")
  await screenshot("02");

  console.log("Logging in...");
  await page.type("#eliloUserID", process.env.AMEX_USERNAME);
  await page.type("#eliloPassword", process.env.AMEX_PASSWORD);
  await screenshot("03");
  await Promise.all([page.waitForNavigation(), page.click("#loginSubmit")]);
  await screenshot("04");

  console.log("Visiting export statement data page...");
  await Promise.all([
    page.waitForNavigation(),
    page.goto(
      "https://global.americanexpress.com/myca/intl/download/emea/download.do?BPIndex=0&request_type=&inav=gb_myca_pc_statement_export_statement_data&Face=en_GB&sorted_index=1"
    )
  ]);
  await screenshot("05");

  console.log("Clicking away euc mask...");
  await page.waitForSelector("#euc_mask", { visible: true })
  await page.click("#euc_mask")
  await screenshot("06");

  console.log("Selecting CSV");
  await page.click("#CSV");
  await screenshot("07");

  console.log("Selecting BA card");
  await page.click("#selectCard11");
  await screenshot("08");

  console.log("Selecting all periods");
  await page.click("#radioid10");
  await page.click("#radioid11");
  await page.click("#radioid12");
  await page.click("#radioid13");
  await screenshot("09");

  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: "/tmp/"
  });

  console.log("Starting download...");
  await page.evaluate(() => formSubmit1('2','4'));

  console.log("Waiting for download to finish...");
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Download did not finish after 30 seconds."));
    }, 30000);

    fs.watch("/tmp/", (eventType, filename) => {
      if (
        eventType === "rename" &&
        filename === "ofx.csv"
      ) {
        console.log("File detected...");
        clearTimeout(timer);
        resolve();
      }
    });
  });
  await screenshot("10");

  console.log("Closing browser...");
  await browser.close();

  console.log("Moving file...");
  fs.copyFileSync("/tmp/ofx.csv", "./ofx.csv");

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
