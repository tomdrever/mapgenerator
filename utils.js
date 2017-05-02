// JS string formatting - credit "fearphage" on SO
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match
    })
  }
}

// Simple rounding
function round(num, dp) {
  return Math.round(num * dp) / dp;
}

// Simple rng - TODO - use seed?
function random(min, max) {
  return Math.floor((Math.random() * max) + min);
}

// Simple clamp function
function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function scale(number, oldMin, oldMax, newMin, newMax) {
  var oldRange = (oldMax - oldMin); 
  var newRange = (newMax - newMin);
  return (((number - oldMin) * newRange) / oldRange) + newMin;
}

// Creates a simple grid (jagged array)
function createGrid(size) {
  var grid = new Array(size);

  for (var i = 0; i < size; i++) {
    grid[i] = new Array(size);

    for (var j = 0; j < size; j++) {
      // Initial the values in the grid as 0
      grid[i][j] = 0;
    }
  }

  return grid;
}