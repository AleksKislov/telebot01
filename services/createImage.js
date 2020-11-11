const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

const width = 1000;
const height = 1000;
const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");
context.fillStyle = "#fff";
context.textAlign = "center";

const createBackground = () => {
  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);
};

const writeChinese = chineseText => {
  context.font = "bold 40pt Menlo";
  // context.textBaseline = "top";
  // context.fillStyle = "#3574d4";
  // const textWidth = context.measureText(chineseText).width;
  // context.fillRect(width / 2 - textWidth / 2 - 10, 170 - 15, textWidth + 20, 100);

  context.fillText(chineseText, width / 2, 170);
};

const writePinyin = pinyin => {
  context.font = "bold 24pt Menlo";
  if (pinyin.length > 40) {
    pinyin = pinyin.split(" ");
    const halfInd = Math.ceil(pinyin.length / 2);
    context.fillText(pinyin.slice(0, halfInd).join(" "), width / 2, 280);
    context.fillText(pinyin.slice(halfInd).join(" "), width / 2, 320);
  } else {
    context.fillText(pinyin, width / 2, 280);
  }
};

const writeRussian = russianText => {
  context.font = "20pt Menlo";
  context.fillText(russianText, width / 2, 434);
};

// createBackground();

// writeChinese("说起来容易，做起来难");
// writePinyin("shuōqǐlái róngyì, zuòqǐlái nán");
// writeRussian("Сказать легко, а сделать - сложно.");

loadImage("../images/backgrounds/bg04.png").then(image => {
  context.drawImage(image, 0, 0, 1000, 1000);

  writeChinese("说起来容易，做起来难说起来容易，做起来难");
  writePinyin("shuōqǐlái róngyì, zuòqǐlái nán shuōqǐlái róngyì, zuòqǐlái nán nán");
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
