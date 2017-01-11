var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var canvasStyle = window.getComputedStyle(canvas, null);

var canvasWidth = parseInt(canvasStyle.width.replace("px", ""))
var canvasHeight = parseInt(canvasStyle.height.replace("px", ""))

var cellSize = canvasWidth / 50;

console.log(cellSize)

var color = 0;

var border = cellSize / 20;

for (var x = 0; x < canvasWidth; x += cellSize) {
  for (var y = 0; y < canvasHeight; y += cellSize) {
    context.fillStyle = "rgb(" + color + ", 0, 0)"
    context.fillRect(x, y, cellSize - border, cellSize - border )

    console.log("oragne")
  }
  color += 5
}

function onDownloadClick () {
  alert("Alert")
}
