const measureFontHeight = (canvas, text, fontStyle) => {
  var context = canvas.getContext("2d");

  var sourceWidth = canvas.width;
  var sourceHeight = canvas.height;

  context.font = fontStyle;

  // place the text somewhere
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText(text, 0, 0);
  var widthText = context.measureText(text).width;

  var data = context.getImageData(0, 0, sourceWidth, sourceHeight).data;

  var firstY = -1;
  var lastY = -1;

  // loop through each row
  for (var y = 0; y < sourceHeight; y++) {
    // loop through each column
    for (var x = 0; x < sourceWidth; x++) {
      //var red = data[((sourceWidth * y) + x) * 4];
      //var green = data[((sourceWidth * y) + x) * 4 + 1];
      //var blue = data[((sourceWidth * y) + x) * 4 + 2];
      var alpha = data[(sourceWidth * y + x) * 4 + 3];

      if (alpha > 0) {
        firstY = y;
        // exit the loop
        break;
      }
    }
    if (firstY >= 0) {
      // exit the loop
      break;
    }
  }

  // loop through each row, this time beginning from the last row
  for (var y = sourceHeight; y > 0; y--) {
    // loop through each column
    for (var x = 0; x < sourceWidth; x++) {
      var alpha = data[(sourceWidth * y + x) * 4 + 3];
      if (alpha > 0) {
        lastY = y;
        // exit the loop
        break;
      }
    }
    if (lastY >= 0) {
      // exit the loop
      break;
    }
  }

  return {
    // The actual height
    height: lastY - firstY,

    width: widthText,

    // The first pixel
    firstPixel: firstY,

    // The last pixel
    lastPixel: lastY
  };
};

module.exports = measureFontHeight;
