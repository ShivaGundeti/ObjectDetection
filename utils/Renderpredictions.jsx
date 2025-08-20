export const renderPredictions = (predictions, ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";
// console.log(predictions);

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction["bbox"];
    const isPerson = prediction.class === "person";

    // bounding box
    ctx.strokeStyle = isPerson ? "#FF0000" : "#00FFFF";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    // semi-transparent fill
    ctx.fillStyle = isPerson ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 255, 255, 0.2)";
    ctx.fillRect(x, y, width, height);

    // label background
    ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10);
    ctx.fillRect(x, y, textWidth + 6, textHeight + 4);

    // label text
    ctx.fillStyle = "#000";
    ctx.fillText(prediction.class, x, y);
    
    
  });
};
