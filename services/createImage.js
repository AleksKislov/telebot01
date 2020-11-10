const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");

const createBackground = () => {
  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);
};

const writeChinese = chineseText => {
  context.font = "bold 40pt Menlo";
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = "#3574d4";

  const textWidth = context.measureText(chineseText).width;
  context.fillRect(600 - textWidth / 2 - 10, 170 - 15, textWidth + 20, 100);
  context.fillStyle = "#fff";
  context.fillText(chineseText, 600, 170);
};

const writePinyin = pinyin => {
  context.fillStyle = "#34a0e3";
  context.font = "bold 24pt Menlo";
  context.fillText(pinyin, 600, 280);
};

const writeRussian = russianText => {
  context.fillStyle = "#fff";
  context.font = "20pt Menlo";
  context.fillText(russianText, 600, 334);
};

createBackground();

writeChinese("说起来容易，做起来难");
writeRussian("Сказать легко, а сделать - сложно.");
writePinyin("shuōqǐlái róngyì, zuòqǐlái nán");

const footerText = `каждый день с озвучкой в телеграме:
      t.me/chineseplusnew`;
context.fillStyle = "#fff";
context.font = "16pt Menlo";
context.fillText(footerText, 630, 530);

loadImage("../images/logo.png").then(image => {
  context.drawImage(image, 330, 515, 70, 70);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("../images/created/test.png", buffer);
});
