// -- Get DOM elements -- 
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var image = document.getElementById("image");

// Get option inputs
var gridSizeInput = document.getElementById("grid-size-input");
var gridHeightOffsetInput = document.getElementById("grid-heightoffset-input");
var falloffGradientInput = document.getElementById("grid-falloffgradient-input");
var falloffAreaInput = document.getElementById("grid-falloffarea-input");
var outlineModeInput = document.getElementById("grid-outlinemode-input");
var extraColourInput = document.getElementById("grid-extracolour-input");

// Generate an initial map when the page first loads
newMap();

// -- Set button onclicks --
function onSourceClicked() {
  // Open a new window/tab containing the github page
  window.open("https://www.github.com/tomdrever/mapgenerator", "_blank");
}

function onDownloadClicked(link) {
  // Get the source of the current displayed map and download it
  link.href = image.src;
}

function onCanvasClicked() {
  // Open a new window/tab containing a large img of the current map  
  var newWindow = window.open("about:blank", "_blank")
  newWindow.document.write("<hmtl><head><title>Map Image</title><head><img style='image-rendering: pixelated; width: 100em; height: 100em;' src={0}></img></html>".format(image.src))
}

function newMap() {
  // Get the size of the map grid, using the grid-size (resolution) input
  // and the formula size = 2^n +1
  var gridSize =  Math.pow(2, gridSizeInput.value) + 1;

  // Trigger the buttons "loading" animation
  document.getElementById("new-map-button").className = "loading";

  // Resize the off-screen canvas to match the grid size
  canvas.setAttribute("width", gridSize);
  canvas.setAttribute("height", gridSize);

  // Store the current options in a "MapGenSettings" object
  var mapGenSettings = new MapGenSettings(
    gridHeightOffsetInput.value, 
    falloffGradientInput.value, 
    falloffAreaInput.value,
    outlineModeInput.checked,
    extraColourInput.checked)

  // In about 50ms... (this is to make sure the loading animation has time to play)
  setTimeout(function() {
    // Get a new map from the mapgen.js script (this is displayed on the off-screen
    // canvas)
    createMap(context, gridSize, mapGenSettings);

    // Load the image on the off-screen canvas to the main img
    image.src = canvas.toDataURL(); 

    // Stop the loading animation
    document.getElementById("new-map-button").className = "";
  }, 50)
}
