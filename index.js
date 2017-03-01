var canvas = document.getElementById("canvas")
var context = canvas.getContext('2d')

var canvasStyle = window.getComputedStyle(canvas, null)

var canvasWidth = parseInt(canvasStyle.width.replace("px", ""))
var canvasHeight = parseInt(canvasStyle.height.replace("px", ""))

var processing = document.getElementById("processing_wrapper")

var gridSizeInput = document.getElementById("grid-size-input")
var gridHeightOffsetInput = document.getElementById("grid-heightoffset-input")
var falloffGradientInput = document.getElementById("grid-falloffgradient-input")
var falloffAreaInput = document.getElementById("grid-falloffarea-input")

newMap()

function onSourceClicked() {
  var newWindow = window.open("https://www.github.com/tomdrever/mapgenerator", "_blank")
}

function onDownloadClicked(link) {
  link.href = canvas.toDataURL("image/png", 1.0)
}

function onNewMapClicked() {
  newMap()
}

function onCanvasClicked() {
  var newWindow = window.open("about:blank", "_blank")
  newWindow.document.write("<hmtl><head><title>Map Image</title><head><img src={0}></img></html>".format(canvas.toDataURL("image/png", 1.0)))
}

function newMap() {
  processing.style.display = "flex"

  context.clearRect(0, 0, canvasWidth, canvasHeight)

  var gridSize = Math.pow(2, gridSizeInput.value) + 1
  var mapGenSettings = new MapGenSettings(gridHeightOffsetInput.value, falloffGradientInput.value, falloffAreaInput.value)

  var cellSize = canvasWidth / gridSize

  setTimeout(function() {
    drawMap(context, gridSize, cellSize, mapGenSettings)

    processing.style.display = "none"
  }, 50)
}
