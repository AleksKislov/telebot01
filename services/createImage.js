const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

const width = 1000;
const height = 1000;
const zhTextHeight = height * 0.27;
const pinyinHeight = height * 0.42;
const ruTextHeight = height * 0.57;
const chineseFont = "bold 40pt Menlo"; // max 16 chars for line
const pinyinFont = "bold 24pt Menlo"; // max 42 chars
const rusFont = "20pt Menlo"; // max 52 chars

const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");
context.fillStyle = "#fff";
context.textAlign = "center";

const createBackground = () => {
  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);
};

const writeChinese = chineseText => {
  const zh_length = chineseText.length;
  context.font = chineseFont;

  if (zh_length > 32) throw new Error("Слишком длинный китайский текст!");

  if (zh_length > 16) {
    const halfInd = Math.ceil(zh_length / 2) + 2;
    context.fillText(chineseText.slice(0, halfInd), width / 2, zhTextHeight);
    context.fillText(chineseText.slice(halfInd), width / 2, zhTextHeight + 60);
  } else {
    context.fillText(chineseText, width / 2, zhTextHeight);
  }
};

const writePinyin = pinyin => {
  context.font = pinyinFont;
  if (pinyin.length > 42) {
    pinyin = pinyin.split(" ");
    const halfInd = Math.ceil(pinyin.length / 2) + 1;
    context.fillText(pinyin.slice(0, halfInd).join(" "), width / 2, pinyinHeight);
    context.fillText(pinyin.slice(halfInd).join(" "), width / 2, pinyinHeight + 45);
  } else {
    context.fillText(pinyin, width / 2, pinyinHeight);
  }
};

const writeRussian = russianText => {
  context.font = rusFont;
  if (russianText.length > 52) {
    russianText = russianText.split(" ");
    const halfInd = Math.ceil(russianText.length / 2) + 1;
    context.fillText(russianText.slice(0, halfInd).join(" "), width / 2, ruTextHeight);
    context.fillText(russianText.slice(halfInd).join(" "), width / 2, ruTextHeight + 40);
  } else {
    context.fillText(russianText, width / 2, ruTextHeight);
  }
};

const writeFooter = () => {
  const footerText = `каждый день с озвучкой в телеграме:
      t.me/chineseplusnew`;
  context.font = "16pt Menlo";
  context.fillText(footerText, width * 0.54, height * 0.89);
};

const createImage = ({ chinese, pinyin, russian, id }) => {
  loadImage("../images/backgrounds/bg04.png").then(image => {
    context.drawImage(image, 0, 0, 1000, 1000);
    writeChinese(chinese);
    writePinyin(pinyin);
    writeRussian(russian);
    writeFooter();
  });

  loadImage("../images/backgrounds/logo.png").then(image => {
    context.drawImage(image, width * 0.25, height * 0.87, 50, 50);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(`../images/created/phrases/phrase_${id}.png`, buffer);
  });
};

// createImage({ chinese: "sdsd", pinyin: "sdas", russian: "dds", id: 13 });

module.exports = createImage;
