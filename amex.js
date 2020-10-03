const axios = require("axios");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const log = require("./log");

//const screenshot = async tag => {
//  if (process.env.TAKE_SCREENSHOTS) {
//    log.info("Taking screenshot " + tag);
//    await page.screenshot({path: path.resolve(__dirname, 'screenshots', tag + '.png')});
//  }
//};

const scrape = async () => {
  log.info("Opening browser...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1024,
    height: 768,
    deviceScaleFactor: 1,
  });

  log.info("Navigating to login page...")
  await Promise.all([
    page.waitForNavigation(),
    page.goto("https://www.americanexpress.com/en-gb/account/login?inav=iNavLnkLog")
  ]);

  log.info("Clicking away cookie notice...");
  await page.waitForSelector("#sprite-AcceptButton_EN", { visible: true })
  await page.click("#sprite-AcceptButton_EN")

  log.info("Logging in...");
  await page.waitForSelector("#eliloUserID", { visible: true })
  await page.type("#eliloUserID", process.env.AMEX_USERNAME);
  await page.type("#eliloPassword", process.env.AMEX_PASSWORD);
  await Promise.all([page.waitForNavigation(), page.click("#loginSubmit")]);

  log.info("Extracting cookies")
  const cookies = await page.cookies()
  const cookieStr = cookies.reduce((acc, cookie) => {
    return `${acc} ${cookie.name}=${cookie.value};`;
  }, "")

  log.info("Closing browser...");
  await browser.close();

  log.info("Downloading CSV file")
  await download(cookieStr)
};

async function download (cookieStr) {
  const url = "https://global.americanexpress.com/api/servicing/v1/financials/documents?file_format=csv&limit=3350&status=posted&start_date=2017-01-01&end_date=2025-01-01&additional_fields=true&account_key=C51E4093EC07EE08B161AA229C627F21&client_id=AmexAPI"
  const writer = fs.createWriteStream(path.resolve(__dirname, 'download', 'activity.csv'))
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    headers: { Cookie: cookieStr }
  })
  response.data.pipe(writer)
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

module.exports = { scrape };
