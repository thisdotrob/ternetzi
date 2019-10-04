const puppeteer = require("puppeteer");
const fs = require("fs");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scrape = async () => {
  console.log("Opening browser...");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const screenshot = async tag => {
    await page.screenshot({path: 'screenshot-' + tag + '.png'});
  };

  console.log("Visiting amex statement export page...");
  await Promise.all([
    page.waitForNavigation(),
    page.goto("https://global.americanexpress.com/myca/intl/download/emea/download.do?BPIndex=0&request_type=&inav=gb_myca_pc_statement_export_statement_data&Face=en_GB&sorted_index=1")
  ]);
  await screenshot("00");

  console.log("Clicking away euc mask...");
  await page.waitForSelector("#euc_mask", { visible: true })
  await page.click("#euc_mask")
  await screenshot("01");

  console.log("Logging in...");
  await page.type("#lilo_userName", process.env.AMEX_USERNAME);
  await page.type("#lilo_password", process.env.AMEX_PASSWORD);
  await screenshot("02");
  await Promise.all([page.waitForNavigation(), page.click("#lilo_formSubmit")]);
  await screenshot("03");

  console.log("Selecting CSV");
  await page.click("#CSV");
  await screenshot("04");

  console.log("Selecting BA card");
  await page.click("#selectCard11");
  await screenshot("05");

  console.log("Selecting all periods");
  await page.click("#radioid10");
  await page.click("#radioid11");
  await page.click("#radioid12");
  await page.click("#radioid13");
  await screenshot("06");

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
  await screenshot("07");

  console.log("Closing browser...");
  await browser.close();

  console.log("Moving file...");
  fs.copyFileSync("/tmp/ofx.csv", "./ofx.csv");

  console.log("Removing temporary file...");
  fs.unlinkSync("/tmp/ofx.csv");
};

module.exports = { scrape };
