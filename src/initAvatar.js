const { createCanvas } = require("canvas");
const measureFontHeight = require("./measureFontHeight");
const b64toBlob = require("b64-to-blob");
const { canvasToBlob } = require("blob-util");
const atob = require("atob");
const fs = require("fs");

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], "base64");

  return response;
}

const defProps = { save: true };

const initAvatar = (avatar, config = defProps) => {
  const { font, text, textColor, backgroundColor, width, height, box } = avatar;
  const { save } = config;

  const canvas = createCanvas(width, height);
  const bg = canvas.getContext("2d");
  const textContext = canvas.getContext("2d");
  const textSize = measureFontHeight(canvas, text, font);

  bg.fillStyle = backgroundColor;
  bg.fillRect(0, 0, width, height);

  if (box) {
    const bg2 = canvas.getContext("2d");

    bg2.fillStyle = box.backgroundColor;
    bg2.fillRect(
      (width - box.width) / 2,
      (height - box.height) / 2,
      box.width,
      box.height
    );
  }

  textContext.font = avatar.font;
  textContext.textBaseline = "top";
  textContext.fillStyle = avatar.textColor;
  textContext.fillText(
    avatar.text,
    (avatar.width - textSize.width) / 2,
    (avatar.height - textSize.height) / 2 - textSize.firstPixel,
    textSize.width,
    textSize.height
  );

  const blobBase = canvas.toDataURL();
  const blobClean = blobBase.replace(/^data:image\/png;base64,/, "");

  var imageBuffer = decodeBase64Image(blobBase);

  if (save) {
    fs.writeFile("_" + text + ".png", imageBuffer.data, function(err) {
      if (err) console.log(err);
      console.log("saved file");
    });
  }

  return {
    dataURL: blobBase,
    dataFile: imageBuffer.data
  };
};

module.exports = initAvatar;
