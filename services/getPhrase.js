const puppeteer = require('puppeteer');
require('dotenv').config();

const _myStore = {
  page: null,
  url: process.env.WEBSITE_URL,
  proverb: {
    xPathChin: process.env.PROVERB_CHIN,
    xPathPinyin: process.env.PROVERB_PINYIN,
    xPathEng: process.env.PROVERB_ENG,
  },
  sentence: {
    xPathChin: process.env.SENT_CHIN,
    xPathPinyin: process.env.SENT_PINYIN,
    xPathEng: process.env.SENT_ENG,
    xPathName: process.env.SENT_NAME,
  },
};

const extractText = async (xPath, isName) => {
  const [el] = await _myStore.page.$x(xPath);
  const textContent = await el.getProperty('textContent');
  const raw = await textContent.jsonValue();
  if (isName) return raw.slice(2).trim();
  return raw.trim();
};

/**
 * @param {string} phraseType - proverb or sentence
 */
const getPhrase = async (phraseType) => {
  if (phraseType === 'proverb') {
    var {
      url,
      proverb: { xPathChin, xPathPinyin, xPathEng },
    } = _myStore;
  } else if (phraseType === 'sentence') {
    var {
      url,
      sentence: { xPathChin, xPathPinyin, xPathEng, xPathName },
    } = _myStore;
  }

  try {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();
    _myStore.page = page;
    await page.goto(url);

    const path1 = page.waitForXPath(xPathChin, 3000);
    const path2 = page.waitForXPath(xPathPinyin, 3000);
    const path3 = page.waitForXPath(xPathEng, 3000);
    if (phraseType === 'sentence')
      var path4 = page.waitForXPath(xPathName, 3000);
    await Promise.all([path1, path2, path3, path4]);

    const chinese = await extractText(xPathChin);
    const english = await extractText(xPathEng);
    const pinyin = await extractText(xPathPinyin);
    if (phraseType === 'sentence') {
      var name = await extractText(xPathName);
      name = name.slice(1).trim();
    } else if (phraseType === 'proverb') {
      var name = 'пословица';
    }
    await browser.close();

    return { chinese, pinyin, english, name };
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getPhrase };
