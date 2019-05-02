const http = require("http");
const express = require("express");
const { createCanvas, loadImage, registerFont } = require("canvas");
const initAvatar = require("./initAvatar");
const path = require("path");
const { generateRandomColors, textHUSL } = require("./generateColors");
const chroma = require("chroma-js");
var bodyParser = require("body-parser");

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

registerFont("./fonts/ZCOOLKuaiLe-Regular.ttf", {
  family: "ZCOOL KuaiLe"
});

const avatarConfig = {
  font: "185px ZCOOL KuaiLe",
  text: "t",
  textColor: "#1a3263",
  backgroundColor: "#f16821",
  width: 255,
  height: 255,
  box: {
    width: 255,
    height: 255,
    backgroundColor: "#e8e2db"
  }
};

const createImage = url => {
  return `<img src="${url}" />`;
};

const generateAvatar = (data, config) => {
  const avatar = initAvatar(data, config);
  const url = avatar.dataURL;
  const file = avatar.dataFile;

  return avatar;
};

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.post("/avatar", (req, res) => {
  res.set("Content-Type", "image/png");

  const colors = generateRandomColors(24);
  let config = { save: false };

  if (colors) {
    avatarConfig.textColor = textHUSL(colors[5]);
    avatarConfig.backgroundColor = colors[4];
    avatarConfig.box.backgroundColor = colors[3];
  }

  if (req.body.text) {
    avatarConfig.text = req.body.text;
  } else {
    avatarConfig.text = "B";
  }

  const avatar = generateAvatar(avatarConfig, config);

  return res.send(avatar.dataFile);
});

app.get("/", (req, res) => {
  res.set("Content-Type", "image/png");

  const colors = generateRandomColors(24);
  let config = {};

  if (colors) {
    avatarConfig.textColor = textHUSL(colors[5]);
    avatarConfig.backgroundColor = colors[4];
    avatarConfig.box.backgroundColor = colors[3];
  }

  if (req.query && Object.keys(req.query)[0]) {
    avatarConfig.text = Object.keys(req.query)[0];
    if (req.query[Object.keys(req.query)[0]]) {
      config = { save: true };
    }
  } else {
    avatarConfig.text = "B";
  }

  const avatar = generateAvatar(avatarConfig, config);

  return res.send(avatar.dataFile);
});

app.get("/index", (req, res) => {
  res.set("Content-Type", "text/html");

  return res.sendFile(path.join(__dirname, "../index.html"));
});

const server = http.createServer(app);
server.listen(8080);
