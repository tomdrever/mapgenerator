// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var canvasStyle = window.getComputedStyle(canvas, null);

var canvasWidth = parseInt(canvasStyle.width.replace("px", ""))
var canvasHeight = parseInt(canvasStyle.height.replace("px", ""))

onNewMapClick()

function onDownloadClick () {
  alert("Alert")
}

function onNewMapClick() {
  // TODO - get values in settings
  var gridSize = 250
  var border = 0;

  var cellSize = canvasWidth / gridSize;

  for (var x = 0; x < canvasWidth; x += cellSize) {
    for (var y = 0; y < canvasHeight; y += cellSize) {
      context.fillStyle = "rgb({0}, {1}, {2})".format(random(255), random(255), random(255))
      context.fillRect(x, y, cellSize - border, cellSize - border )
    }
  }
}

function round(num, dp) {
  return Math.round(num * dp) / dp
}

function random( max) {
  return Math.floor((Math.random() * max) + 1);
}
