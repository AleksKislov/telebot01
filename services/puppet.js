const puppeteer = require("puppeteer");
const fs = require("fs");
const {
  website2,
  password2,
  username,
  waitFor2,
  clickIt2,
  cookiesPath2
} = require("../config/config.json");

const logIn = async (website, password, username, waitForIt, clickIt, cookiesPath) => {
  const cookies = require(cookiesPath);
  console.log("Hello World");
  //insert code here

  let browser = await puppeteer.launch({ headless: false });
  const context = browser.defaultBrowserContext();
  context.overridePermissions(website + "login", []);
  let page = await browser.newPage();
  await page.setDefaultNavigationTimeout(100000);
  await page.setViewport({ width: 1200, height: 800 });

  if (!Object.keys(cookies).length) {
    await page.goto(website + "login", { waitUntil: "networkidle2" });
    await page.type("#email", username, { delay: 30 });
    await page.type("#pass", password, { delay: 30 });
    await page.click(clickIt);

    // await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.waitFor(10000);
    try {
      await page.waitFor(waitForIt);
    } catch (err) {
      console.log("failed to login");
      process.exit(0);
    }
    let currentCookies = await page.cookies();
    fs.writeFileSync("../config/cookies2.json", JSON.stringify(currentCookies));
  } else {
    //User Already Logged In
    await page.setCookie(...cookies);
    await page.goto(website, { waitUntil: "networkidle2" });
  }

  //Close Browser
  //await browser.close();
};

logIn(website2, password2, username, waitFor2, clickIt2, cookiesPath2);
