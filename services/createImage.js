const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

const width = 1000;
const height = 1000;
const zhTextHeight = 0.27; // percent from heght
const pinyinHeight = 0.4;
const ruTextHeight = 0.57;
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

// max line length == 16
const writeChinese = chineseText => {
  context.font = chineseFont;
  context.fillText(chineseText, width / 2, height * zhTextHeight);
};

const writePinyin = pinyin => {
  context.font = pinyinFont;
  if (pinyin.length > 40) {
    pinyin = pinyin.split(" ");
    const halfInd = Math.ceil(pinyin.length / 2);
    context.fillText(pinyin.slice(0, halfInd).join(" "), width / 2, height * pinyinHeight);
    context.fillText(pinyin.slice(halfInd).join(" "), width / 2, height * pinyinHeight + 50);
  } else {
    context.fillText(pinyin, width / 2, height * pinyinHeight);
  }
};

const writeRussian = russianText => {
  context.font = rusFont;
  context.fillText(russianText, width / 2, height * ruTextHeight);
};

// createBackground();

loadImage("../images/backgrounds/bg04.png").then(image => {
  context.drawImage(image, 0, 0, 1000, 1000);

  writeChinese("说起来容易，做起来难说起来容易");
  writePinyin("shuōqǐlái róngyì, zuòqǐlái nán");
  writeRussian(`Сказать легко, а сделать - сложно.`);
});

// const footerText = `каждый день с озвучкой в телеграме:
//       t.me/chineseplusnew`;
// context.fillStyle = "#fff";
// context.font = "16pt Menlo";
// context.fillText(footerText, 630, 530);

loadImage("../images/backgrounds/logo.png").then(image => {
  context.drawImage(image, 330, height * 0.83, 70, 70);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("../images/created/test.png", buffer);
});
