const puppeteer = require("puppeteer");
const fs = require("fs");
const log = require("./log");

const TAKE_SCREENSHOTS = false;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scrape = async () => {
  log.info("Opening browser...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const screenshot = async tag => {
    if (TAKE_SCREENSHOTS) {
      log.info("Taking screenshot " + tag);
      await page.screenshot({path: '/tmp/ternetzi_screenshot' + tag + '.png'});
    }
  };

  await page.setViewport({
    width: 1024,
    height: 768,
    deviceScaleFactor: 1,
  });

  log.info("Visiting amex statement export page...");
  await Promise.all([
    page.waitForNavigation(),
    page.goto("https://global.americanexpress.com/myca/intl/download/emea/download.do?BPIndex=0&request_type=&inav=gb_myca_pc_statement_export_statement_data&Face=en_GB&sorted_index=0")
  ]);
  await screenshot("00");

  log.info("Logging in...");
  await page.waitForSelector("#eliloUserID", { visible: true })
  await page.type("#eliloUserID", process.env.AMEX_USERNAME);
  await page.type("#eliloPassword", process.env.AMEX_PASSWORD);
  await screenshot("02");
  await Promise.all([page.waitForNavigation(), page.click("#loginSubmit")]);
  await screenshot("03");

  log.info("Clicking away cookie notice...");
  await page.waitForSelector("#sprite-AcceptButton_EN", { visible: true })
  await page.click("#sprite-AcceptButton_EN")
  await screenshot("01");

  log.info("Selecting CSV");
  await page.click("#CSV");
  await screenshot("04");

  log.info("Selecting BA card");
  await page.click("#selectCard10");
  await screenshot("05");

  log.info("Selecting all periods");
  await page.click("#radioid00");
  await page.click("#radioid01");
  await page.click("#radioid02");
  await page.click("#radioid03");
  await screenshot("06");

  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: "/tmp/"
  });

  log.info("Starting download...");
  await page.click(".blueButtonCenter");

  log.info("Waiting for download to finish...");
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Download did not finish after 30 seconds."));
    }, 30000);

    fs.watch("/tmp/", (eventType, filename) => {
      if (
        eventType === "rename" &&
        filename === "ofx.csv"
      ) {
        log.info("File detected...");
        clearTimeout(timer);
        resolve();
      }
    });
  });
  await screenshot("07");

  log.info("Closing browser...");
  await browser.close();
};

module.exports = { scrape };
