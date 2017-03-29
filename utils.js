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
  return Math.round(num * dp) / dp
}

// Simple rng - TODO - use seed?
function random(min, max) {
  return Math.floor((Math.random() * max) + min);
}

// Simple clamp function
function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}
