// -- A simple class to store the current options --
function MapGenSettings(heightOffset, falloffGradient, falloffArea, outlineMode) {
  this.heightOffset = heightOffset;
  this.falloffGradient = falloffGradient;
  this.falloffArea = falloffArea;
  this.outlineMode = outlineMode;
}

// -- TerrainMap is a map of a value (from the DS algorithm) to a colour,
// representing a different height of terrain --
var terrainMap = new Map()
// Deep Ocean
terrainMap[0.05] = [31, 3, 168]
// Ocean
terrainMap[0.15] = [15, 144, 199]
// Beach/Shore
terrainMap[0.30] = [217, 219, 141]
// Lowest/grassland/forest/etc
terrainMap[0.40] = [99, 196, 0]
// Low/grassland/forest/etc
terrainMap[0.60] = [0, 127, 20]
// Hills/rocky/high terrain
terrainMap[0.80] = [100, 82, 29]
// Mountains/highest terrain
terrainMap[0.95] = [100, 83, 64]

function DiamondSquare(size, heightOffset) {
  // heightOffset is a number by which (alongside another random number) the height each tile of island
  // is modified. it correlates to smoothness
  this.size = size;
  this.heightOffset = heightOffset;

  // Create an empty grid, an array of arrays (size * size)
  this.data = createGrid(size);
}

DiamondSquare.prototype = {
  diamond:function(x, y, sideLength) {
    var halfSide = sideLength / 2;

    // Get the average of the four points on the diamond (wrapping
    // if necessary)
    var avg = this.data[(x - halfSide + this.size - 1) % (this.size - 1)][y] +
      this.data[(x + halfSide) % (this.size - 1)][y] +
      this.data[x][(y + halfSide) % (this.size - 1)] +
      this.data[x][(y - halfSide + this.size - 1) % (this.size - 1)];
	  avg /= 4.0;

    // Add a "random" offset
    avg += (Math.random() * 2 * this.heightOffset) - this.heightOffset;

    // Clamp between 0 and 1
    avg = clamp(avg, 0.0, 1.0)

    this.data[x][y] = avg;

    // Wrap the values
    if (x == 0) this.data[this.size - 1][y] = avg;
    if (y == 0) this.data[x][this.size - 1] = avg;
  },

  square:function(x, y, sideLength) {
    var halfSide = sideLength / 2;

    // Get the average of the four surrounding corners
    var avg = this.data[x][y] +
      this.data[x + sideLength][y] +
      this.data[x][y + sideLength] +
      this.data[x + sideLength][y + sideLength];
    avg /= 4.0;

    // Add a "random" offset
    avg += (Math.random() * 2 * this.heightOffset) - this.heightOffset;

    // Clamp between 0 and 1
    avg = clamp(avg, 0.0, 1.0);

    // Set the square value to the average + a random number affected by the smoothness
    this.data[x + halfSide][y + halfSide] = avg;
  },

  // -- Main DS function -- 
  generate:function() {
    // Seed the data: set the top left, top right, bottom left and bottom right values to 0.5 - this
    // gives the algorithm a place to start on its first "Square" phase
    this.data[0][0] = this.data[0][this.size - 1] = this.data[this.size - 1][0] 
      = this.data[this.size -1][this.size - 1] = 0.5;

    // This iterates the algorithm (based on smoothness), increasing the "depth",
    // so it starts with one big square/diamond, and gets smaller and smaller.
    // This is why a higher resolution image is basically the same as a lower one, 
    // except expressed in more details, with more pixels 
    for (var sideLength = this.size - 1; sideLength >= 2; sideLength /= 2, this.heightOffset /= 2.0) {
      // -- Square -- 
      for (var x = 0; x < this.size - 1; x += sideLength) {
        for (var y = 0; y < this.size - 1; y += sideLength) {
          this.square(x, y, sideLength);
        }
      }

      // -- Diamond --
      for (var x = 0; x < this.size - 1; x += sideLength / 2) {
        for (var y = (x + sideLength / 2) % sideLength; y < this.size - 1; y += sideLength) {
          this.diamond(x, y, sideLength);
        }
      }
    }

    return this.data;
  }
}

function FallOff(size, gradient, area) {
  this.size = size;
  this.gradient = gradient;
  this.area = area;
}

FallOff.prototype = {
  // Credit Sebastian Lague for falloffMap
  // Evaluates a value from the fall-off map grid
  evaluatePoint:function(value) {
    // a - Lower a means more gradual fall-off
    var a = this.gradient;

    // b - lower b means less space for island
    var b = this.area;

    return Math.pow(value, a) / (Math.pow(value, a) + Math.pow(b - b * value, a));
  },

  // Generates a fall-off map, a gradual slope towards the sides.
  // Using Math.abs(), values towards the sides will be higher and values in the
  // middle will be lower

  // When taken away from the values generated by the DS algorithm, this means the sides
  // of the heightmap will be lower, creating an "island" effect
  generate:function() {
    // Create a new array grid, the same size as the DS map above
    var grid = new Array(this.size)
    for (i = 0; i < this.size; i++) {
      grid[i] = new Array(this.size)
      for (j = 0; j < this.size; j++) {
        var x = i / this.size * 2 - 1
        var y = j / this.size * 2 - 1

        // Use fancy math to determine the fall-off value for this position on the map
        var value = Math.max(Math.abs(x), Math.abs(y))
        grid[i][j] = this.evaluatePoint(value)
      }
    }

    return grid;
  }
}

// -- Function that actually gets a grid of values, then gets a grid of colours, then
// prints it to the off-screen canvas --
function createMap(context, size, settings) {
  // Generate the required maps
  var dsMap = new DiamondSquare(size, settings.heightOffset).generate()
  var alphaDsMap = new DiamondSquare(size, 2).generate()
  var falloffMap = new FallOff(size, settings.falloffGradient, settings.falloffArea).generate()

  // Get the imagedata of the canvas (for drawing to it by changing the buffer)
  var imageData = context.getImageData(0, 0, size, size);
  var buffer = new Uint8ClampedArray(size * size * 4);

  // Generate the requested style of map
  var previousKey = 0.05;

  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      var DSvalue = clamp(dsMap[x][y] - falloffMap[x][y], 0.0, 1.0);

      var terrainMapKey = getTerrainMapKey(DSvalue);

      var colour = [];

      // If this is a new "strata?" "level?"
      if (terrainMapKey != previousKey && settings.outlineMode) {
        colour = [21, 21, 18];
      } else {
        colour = terrainMap[terrainMapKey];
      }

      setBufferColourAtPosition(buffer, colour, x, y, size, scale(alphaDsMap[x][y], 0, 1, 0.5, 1) * 255);

      previousKey = terrainMapKey;
    }
  }

  // Change the imagedata's buffer
  imageData.data.set(buffer);

  // Update the canvas's imagedata
  context.putImageData(imageData, 0, 0);
}

// -- Given a colour and a position, sets that position in the buffer to that colour --  
function setBufferColourAtPosition(buffer, colour, x, y, size, alpha) {
  var pos = (y * size + x) * 4;

  for (var i = 0; i < 3; i++) {
    buffer[pos + i] = colour[i];
  }

  buffer[pos + 3] = alpha;
}

// -- Function that iterates through the TerrainMap, and returns the colour
// of the "band" or "strata" of terrain the value belongs to --
function getTerrainMapKey(DSvalue) {
  var returnKey;

  for (var key in terrainMap) {
    if (terrainMap.hasOwnProperty(key)) {
      if (DSvalue > key) {
        returnKey = key;
      }
    }
  }

  if (returnKey == null) {
    return 0.05;
  } else {
    return returnKey;
  }
}
