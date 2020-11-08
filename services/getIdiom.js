const puppeteer = require("puppeteer");
require("dotenv").config();

const { WEBSITE3_URL, IDIOM_TRANS, IDIOM_PINYIN, IDIOM_ENG, IDIOM_EXAMPLE } = process.env;

const _myStore = {
  url: WEBSITE3_URL,
  pinyinPath: IDIOM_PINYIN,
  engPath: IDIOM_ENG,
  rusPath: IDIOM_TRANS,
  examplePath: IDIOM_EXAMPLE
};

/**
 * @param {string} idiom
 */
const getIdiom = async idiom => {
  let { url, examplePath, pinyinPath, rusPath, engPath } = _myStore;
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url + encodeURI(idiom), { waitUntil: "load" });

    const pinyinElement = await page.$(pinyinPath);
    let pinyin = await page.evaluate(pinyinElement => pinyinElement.textContent, pinyinElement);
    pinyin = pinyin.trim();

    const rusElement = await page.$(rusPath);
    let russian = await page.evaluate(rusElement => rusElement.textContent, rusElement);
    russian = russian.split(";")[0];

    const exElement = await page.$(examplePath);
    let example = await page.evaluate(exElement => exElement.textContent, exElement);
    example = example.split("。")[0] + "。";

    const engElement = await page.$(engPath);
    let english = await page.evaluate(engElement => engElement.textContent, engElement);
    english = english.split("[")[1].split("]")[0];

    await browser.close();

    const resultData = { pinyin, russian, example, english };
    // console.log(resultData);
    return resultData;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getIdiom };
