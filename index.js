var canvas = document.getElementById("canvas")
var context = canvas.getContext('2d')

var canvasStyle = window.getComputedStyle(canvas, null)

var canvasWidth = parseInt(canvasStyle.width.replace("px", ""))
var canvasHeight = parseInt(canvasStyle.height.replace("px", ""))

var processing = document.getElementById("processing_wrapper")

var gridSizeInput = document.getElementById("grid-size-input")
var gridSmoothnessInput = document.getElementById("grid-smoothness-input")

newMap()

function onDownloadClicked(link) {
  link.href = canvas.toDataURL("image/png", 1.0)
}

function onNewMapClicked() {
  newMap()
}

function onCanvasClicked() {
  var newWindow = window.open("about:blank", "_blank")
  newWindow.document.write("<img src={0}></img>".format(canvas.toDataURL("image/png", 1.0)))
}

function newMap() {
  processing.style.display = "flex"

  context.clearRect(0, 0, canvasWidth, canvasHeight)

  var gridSize = Math.pow(2, gridSizeInput.value) + 1
  var smoothness = gridSmoothnessInput.value;

  var cellSize = canvasWidth / gridSize

  var grid = getGrid(gridSize, smoothness)

  setTimeout(function() {
    for (var x = 0; x < gridSize; x++) {
      for (var y = 0; y < gridSize; y++) {
        context.fillStyle = "rgb({0}, {1}, {2})".format(grid[x][y].r, grid[x][y].g, grid[x][y].b)
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      }
    }

    processing.style.display = "none"
  }, 50)
}
