export const renderPredictions = (predictions, ctx) => {
  // Always clear previous drawings
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Match canvas size with video size
  const videoWidth = ctx.canvas.width;
  const videoHeight = ctx.canvas.height;

  // Fonts
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction["bbox"];

    const isPerson = prediction.class === "person";

    // Scale bbox to video dimensions (in case of mismatch)
    const scaleX = videoWidth / ctx.canvas.width;
    const scaleY = videoHeight / ctx.canvas.height;

    const boxX = x * scaleX;
    const boxY = y * scaleY;
    const boxWidth = width * scaleX;
    const boxHeight = height * scaleY;

    // bounding box
    ctx.strokeStyle = isPerson ? "#FF0000" : "#00FFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // fill the color
    ctx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Draw label
    ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10);
    ctx.fillRect(boxX, boxY, textWidth + 4, textHeight + 4);

    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, boxX, boxY);
  });
};
