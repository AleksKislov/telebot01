const puppeteer = require("puppeteer");
require("dotenv").config();

const {
  WEBSITE1_URL,
  PROVERB_CHIN,
  PROVERB_PINYIN,
  PROVERB_ENG,
  SENT_CHIN,
  SENT_PINYIN,
  SENT_ENG,
  SENT_NAME
} = process.env;

const _myStore = {
  page: null,
  url: WEBSITE1_URL,
  proverb: {
    xPathChin: PROVERB_CHIN,
    xPathPinyin: PROVERB_PINYIN,
    xPathEng: PROVERB_ENG
  },
  sentence: {
    xPathChin: SENT_CHIN,
    xPathPinyin: SENT_PINYIN,
    xPathEng: SENT_ENG,
    xPathName: SENT_NAME
  }
};

const extractText = async (xPath, isName) => {
  const [el] = await _myStore.page.$x(xPath);
  const textContent = await el.getProperty("textContent");
  const raw = await textContent.jsonValue();
  if (isName) return raw.slice(2).trim();
  return raw.trim();
};

/**
 * @param {string} phraseType - proverb or sentence
 */
const getPhrase = async phraseType => {
  if (phraseType === "proverb") {
    var {
      url,
      proverb: { xPathChin, xPathPinyin, xPathEng }
    } = _myStore;
  } else if (phraseType === "sentence") {
    var {
      url,
      sentence: { xPathChin, xPathPinyin, xPathEng, xPathName }
    } = _myStore;
  }

  try {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();
    _myStore.page = page;
    await page.goto(url);

    const path1 = page.waitForXPath(xPathChin, 5000);
    const path2 = page.waitForXPath(xPathPinyin, 5000);
    const path3 = page.waitForXPath(xPathEng, 5000);
    if (phraseType === "sentence") var path4 = page.waitForXPath(xPathName, 5000);
    await Promise.all([path1, path2, path3, path4]);

    const chinese = await extractText(xPathChin);
    const english = await extractText(xPathEng);
    const pinyin = await extractText(xPathPinyin);
    if (phraseType === "sentence") {
      var name = await extractText(xPathName);
      name = name.slice(1).trim();
    } else if (phraseType === "proverb") {
      var name = "пословица";
    }
    await browser.close();

    return { chinese, pinyin, english, name };
  } catch (error) {
    console.log(error);
  }
};

console.log(getPhrase("proverb"));

module.exports = { getPhrase };
