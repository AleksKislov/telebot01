const axios = require("axios");
const cheerio = require("cheerio");
const { WEBSITE3_URL } = process.env;

const getTranslation = async sentence => {
  try {
    const { data } = await axios.get(WEBSITE3_URL + encodeURI(sentence));
    const $ = cheerio.load(data);

    const res = $("meta");

    // console.log(res[2].attribs.content);

    if (res && res[2].attribs) {
      return res[2].attribs.content;
    } else {
      return false;
    }
    // return { translation };
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getTranslation };
