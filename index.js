var canvas = document.getElementById("canvas")
var context = canvas.getContext('2d')
context.imageSmoothingEnabled = false;

var canvasStyle = window.getComputedStyle(canvas, null)

var processing = document.getElementById("processing_wrapper")

var gridSizeInput = document.getElementById("grid-size-input")
var gridHeightOffsetInput = document.getElementById("grid-heightoffset-input")
var falloffGradientInput = document.getElementById("grid-falloffgradient-input")
var falloffAreaInput = document.getElementById("grid-falloffarea-input")
var imageElement = document.getElementById("image")

newMap();

function onSourceClicked() {
  var newWindow = window.open("https://www.github.com/tomdrever/mapgenerator", "_blank")
}

function onDownloadClicked(link) {
  link.href = canvas.toDataURL("image/png", 1.0)
}

function onNewMapClicked() {
  newMap();
}

function onCanvasClicked() {
  var newWindow = window.open("about:blank", "_blank")
  newWindow.document.write("<hmtl><head><title>Map Image</title><head><img style='image-rendering: pixelated; width: 100em; height: 100em;' src={0}></img></html>".format(canvas.toDataURL("image/png", 1.0)))
}

function newMap() {
  var gridSize =  Math.pow(2, gridSizeInput.value) + 1

  canvas.setAttribute('width', gridSize.toString());
  canvas.setAttribute('height', gridSize.toString());

  processing.style.display = "flex"

  context.clearRect(0, 0, gridSize, gridSize)

  var mapGenSettings = new MapGenSettings(gridHeightOffsetInput.value, falloffGradientInput.value, falloffAreaInput.value)

  var cellSize = 1

  setTimeout(function() {
    var image = getMap(context, gridSize, cellSize, mapGenSettings)

    imageElement.src = image;

    processing.style.display = "none"
  }, 50)
}
