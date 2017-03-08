var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var image = document.getElementById("image"); 

var processing = document.getElementById("processing_wrapper")

var gridSizeInput = document.getElementById("grid-size-input")
var gridHeightOffsetInput = document.getElementById("grid-heightoffset-input")
var falloffGradientInput = document.getElementById("grid-falloffgradient-input")
var falloffAreaInput = document.getElementById("grid-falloffarea-input")

newMap();

function onSourceClicked() {
  var newWindow = window.open("https://www.github.com/tomdrever/mapgenerator", "_blank")
}

function onDownloadClicked(link) {
  link.href = image.src;
}

function onNewMapClicked() {
  newMap();
}

function onCanvasClicked() {
  var newWindow = window.open("about:blank", "_blank")
  newWindow.document.write("<hmtl><head><title>Map Image</title><head><img style='image-rendering: pixelated; width: 100em; height: 100em;' src={0}></img></html>".format(image.src))
}

function newMap() {
  var gridSize =  Math.pow(2, gridSizeInput.value) + 1

  processing.style.display = "flex"
  canvas.setAttribute("width", gridSize);
  canvas.setAttribute("height", gridSize);

  var mapGenSettings = new MapGenSettings(gridHeightOffsetInput.value, falloffGradientInput.value, falloffAreaInput.value)

  setTimeout(function() {
    getMap(context, gridSize, mapGenSettings);
    image.src = canvas.toDataURL(); 

    processing.style.display = "none";
  }, 50)
}
