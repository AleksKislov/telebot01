const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

const TESTING_IT = false;
const backgroundImgPath = TESTING_IT ? "../images/backgrounds" : "./images/backgrounds";
const createdImgPath = TESTING_IT ? "../images/created/phrases" : "./images/created/phrases";
const width = 1000;
const height = 1000;
const pinyinHeight = height * 0.27;
const zhTextHeight = height * 0.42;
const ruTextHeight = height * 0.57;
const chineseFont = "bold 40pt Menlo"; // max 16 chars for line
const pinyinFont = "bold 24pt Menlo"; // max 42 chars
const rusFont = "20pt Menlo"; // max 48 chars

const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");
context.fillStyle = "#fff";
context.textAlign = "center";

// const createBackground = () => {
//   context.fillStyle = "#000";
//   context.fillRect(0, 0, width, height);
// };

const writeChinese = chineseText => {
  const zh_length = chineseText.length;
  context.font = chineseFont;

  // delete dot at the end
  if (chineseText[zh_length - 1] === "。") chineseText = chineseText.slice(0, -1);
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

  if (pinyin[pinyin.length - 1] === ".") pinyin = pinyin.slice(0, -1);

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
  const ru_length = russianText.length;
  const russianTextArr = russianText.split(" ");
  const chunkNum = Math.ceil(ru_length / 48);
  const firstInd = Math.ceil(russianTextArr.length / chunkNum);

  for (let i = 0; i < chunkNum; i++) {
    context.fillText(
      russianTextArr.slice(i * firstInd, i * firstInd + firstInd).join(" "),
      width / 2,
      ruTextHeight + i * 40
    );
  }
};

const writeFooter = () => {
  const footerText = `каждый день с озвучкой в телеграме:
      t.me/chineseplusnew`;
  context.font = "16pt Menlo";
  context.fillText(footerText, width * 0.54, height * 0.89);
};

const createImage = ({ chinese, pinyin, russian, id }) => {
  loadImage(backgroundImgPath + "/bg04.png").then(image => {
    context.drawImage(image, 0, 0, 1000, 1000);
    writeChinese(chinese);
    writePinyin(pinyin);
    writeRussian(russian);
    writeFooter();
  });

  loadImage(backgroundImgPath + "/logo.png").then(image => {
    context.drawImage(image, width * 0.25, height * 0.87, 50, 50);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(`${createdImgPath}/phrase_${id}.png`, buffer);
  });
};

// TESTING_IT
// createImage({
//   chinese: "razdsa",
//   pinyin: "sdas",
//   russian: "рис ешь по приправе, тветствующие объективной действительности)",
//   id: "testing"
// });

module.exports = createImage;
