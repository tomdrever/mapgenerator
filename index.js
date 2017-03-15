var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var image = document.getElementById("image");

var gridSizeInput = document.getElementById("grid-size-input")
var gridHeightOffsetInput = document.getElementById("grid-heightoffset-input")
var falloffGradientInput = document.getElementById("grid-falloffgradient-input")
var falloffAreaInput = document.getElementById("grid-falloffarea-input")
var contourModeInput = document.getElementById("grid-contourmode-input")
var outlineModeInput = document.getElementById("grid-outlinemode-input")

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

function onContourModeClicked() {
  outlineModeInput.disabled = contourModeInput.checked;
}

function onCanvasClicked() {
  var newWindow = window.open("about:blank", "_blank")
  newWindow.document.write("<hmtl><head><title>Map Image</title><head><img style='image-rendering: pixelated; width: 100em; height: 100em;' src={0}></img></html>".format(image.src))
}

function newMap() {
  var gridSize =  Math.pow(2, gridSizeInput.value) + 1

  document.getElementById("new-map-button").className = "loading";
  canvas.setAttribute("width", gridSize);
  canvas.setAttribute("height", gridSize);

  var mapGenSettings = new MapGenSettings(
    gridHeightOffsetInput.value, 
    falloffGradientInput.value, 
    falloffAreaInput.value, 
    contourModeInput.checked, 
    outlineModeInput.checked)

  setTimeout(function() {
    getMap(context, gridSize, mapGenSettings);
    image.src = canvas.toDataURL(); 

    document.getElementById("new-map-button").className = "";
  }, 50)
}
