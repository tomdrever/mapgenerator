// JS string formatting - credit "fearphage" on SO
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match
    })
  }
}

function round(num, dp) {
  return Math.round(num * dp) / dp
}

function random(min, max) {
  return Math.floor((Math.random() * max) + min);
}
