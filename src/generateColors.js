const { hsluvToHex } = require("hsluv");
const chroma = require("chroma-js");

const shuffleArray = arr =>
  arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let generateRandomColors = (
  total,
  mode = "lab",
  padding = 0.175,
  parts = 6
) => {
  // modified version of http://www.husl-colors.org/syntax/
  //
  let colors = [];
  const part = Math.floor(total / parts);
  const reminder = total % parts;

  // hues to pick from
  const baseHue = random(0, 360);
  const hues = [0, 50, 120, 200, 310, 340].map(offset => {
    return (baseHue + offset) % 360;
  });

  //  low saturated color
  const baseSaturation = random(5, 40);
  const baseLightness = random(0, 20);
  const rangeLightness = 90 - baseLightness;

  colors.push(
    hsluvToHex([hues[0], baseSaturation, baseLightness * random(0.25, 0.75)])
  );

  for (let i = 0; i < part - 1; i++) {
    colors.push(
      hsluvToHex([
        hues[0],
        baseSaturation,
        baseLightness + rangeLightness * Math.pow(i / (part - 1), 1.5)
      ])
    );
  }

  // random shades
  const minSat = random(50, 70);
  const maxSat = minSat + 30;
  const minLight = random(45, 80);
  const maxLight = Math.min(minLight + 40, 95);

  for (let i = 0; i < part + reminder - 1; i++) {
    colors.push(
      hsluvToHex([
        hues[random(0, hues.length - 1)],
        random(minSat, maxSat),
        random(minLight, maxLight)
      ])
    );
  }

  colors.push(hsluvToHex([hues[0], baseSaturation, rangeLightness]));

  //colors = T(colors);

  if (false) {
    return chroma
      .scale(colors)
      .padding(padding)
      .mode(mode)
      .colors(total);
  }

  return colors;
};

const textHUSL = data => {
  let currentColor = chroma(data);
  let lum = currentColor.luminance();
  let contrastColor;
  if (lum < 0.15) {
    contrastColor = currentColor.set("hsl.l", "+.25");
  } else {
    contrastColor = currentColor.set("hsl.l", "-.35");
  }

  return contrastColor;
};

module.exports = { generateRandomColors, textHUSL };
