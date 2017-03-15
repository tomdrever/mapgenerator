class MapGenSettings {
  constructor(heightOffset, falloffGradient, falloffArea, contourMode, outlineMode) {
    this.heightOffset = heightOffset
    this.falloffGradient = falloffGradient
    this.falloffArea = falloffArea
    this.contourMode = contourMode
    this.outlineMode = outlineMode
  }
}

var terrainMap = new Map()
// Deep Ocean
terrainMap[0.05] = [31, 3, 168]
// Ocean
terrainMap[0.35] = [15, 144, 199]
// Beach/Shore
terrainMap[0.40] = [217, 219, 141]
// Lowest/grassland/forest/etc
terrainMap[0.45] = [99, 196, 0]
// Low/grassland/forest/etc
terrainMap[0.55] = [0, 127, 20]
// Hills/rocky/high terrain
terrainMap[0.70] = [100, 82, 29]
// Mountains/highest terrain
terrainMap[0.85] = [100, 83, 64]

function generateDiamondSquare(size, heightOffset) {
  // Create an empty grid
	var data = new Array(size);
	for (var i = 0; i < size; i++) {
		data[i] = new Array(size);

    for (var j = 0; j < size; j++) {
      data[i][j] = 0;
    }
	}

	// Seed the data
  var SEED = 0.5;
	data[0][0] = data[0][size - 1] = data[size - 1][0] = data[size -1][size - 1] = SEED;

  // This iterates the algorithm (based on smoothness), increasing the "depth"
	for (var sideLength = size - 1; sideLength >= 2; sideLength /= 2, heightOffset /= 2.0) {
		var halfSide = sideLength / 2;

    // SQUARE
		for (var x = 0; x < size - 1; x += sideLength) {
		    for (var y = 0; y < size - 1; y += sideLength) {

            // Get the average of the four surrounding corners
		        var avg = data[x][y] +
                data[x + sideLength][y] +
                data[x][y + sideLength] +
                data[x + sideLength][y + sideLength];
		        avg /= 4.0;

            // Add a "random" offset
            avg += (Math.random() * 2 * heightOffset) - heightOffset;

            // Clamp between 0 and 1
            avg = clamp(avg, 0.0, 1.0)

            // Set the square value to the average + a random number affected by the smoothness
		        data[x + halfSide][y + halfSide] = avg
		    }
		}

    // DIAMOND
		for (var x = 0; x < size - 1; x += halfSide) {
		    for (var y = (x + halfSide) % sideLength; y < size - 1; y += sideLength) {

            // Get the average of the four points on the diamond
		        var avg =
                    data[(x - halfSide + size - 1) % (size - 1)][y] +
                    data[(x + halfSide) % (size - 1)][y] +
                    data[x][(y + halfSide) % (size - 1)] +
                    data[x][(y - halfSide + size - 1) % (size - 1)];
		        avg /= 4.0;

            // Add a "random" offset
		        avg += (Math.random() * 2 * heightOffset) - heightOffset;

            // Clamp between 0 and 1
            avg = clamp(avg, 0.0, 1.0)

		        data[x][y] = avg;

            // Wrap the values
		        if (x == 0) data[size - 1][y] = avg;
		        if (y == 0) data[x][size - 1] = avg;
		    }
		}
	}

	return data;
}

// Credit Sebastian Lague for falloffMap
function evaluateFalloffValue(value, gradient, area) {
  // a - Lower a means more gradual fall-off
  var a = gradient

  // b - lower b means less space for island
  var b = area

  return Math.pow(value, a) / (Math.pow(value, a) + Math.pow(b - b * value, a))
}

function generateFalloffMap(size, gradient, area) {
  var grid = new Array(size)

  for (i = 0; i < size; i++) {
    grid[i] = new Array(size)

    for (j = 0; j < size; j++) {
      // Generates a fall-off map, a gradual slope towards the sides.
      // Using Math.abs(), values towards the sides will be higher and values in the
      // middle will be lower

      // When taken away from the values generated by the DS algorithm, this means the sides
      // of the heightmap will be lower, creating an "island" effect

      var x = i / size * 2 - 1
      var y = j / size * 2 - 1

      var value = Math.max(Math.abs(x), Math.abs(y))

      grid[i][j] = evaluateFalloffValue(value, gradient, area)
    }
  }

  return grid
}

function getMap(context, size, settings) {
  var dsMap = generateDiamondSquare(size, settings.heightOffset)
  var falloffMap = generateFalloffMap(size, settings.falloffGradient, settings.falloffArea)

  var imageData = context.getImageData(0, 0, size, size);
  var buffer = new Uint8ClampedArray(size * size * 4);

  if (settings.contourMode)
  {
    getContourMap(buffer, size, dsMap, falloffMap);
  }
  else if (settings.outlineMode)
  {
    getOutlineMap(buffer, size, dsMap, falloffMap);
  }
  else
  {
    getColourMap(buffer, size, dsMap, falloffMap);
  }

  imageData.data.set(buffer);

  context.putImageData(imageData, 0, 0);
}

function setBufferColourAtPosition(buffer, colour, x, y, size) {
  var pos = (y * size + x) * 4;

  for (var i = 0; i < 3; i++) {
    buffer[pos + i] = colour[i];
  }

  buffer[pos + 3] = 255;
}

function getOutlineMap(buffer, size, dsMap, falloffMap)
{
  var previousKey = 0.05;

  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      var DSvalue = clamp(dsMap[x][y] - falloffMap[x][y], 0.0, 1.0);

      var terrainMapKey = getTerrainMapKey(DSvalue);

      var colour = [];

      // If this is a new "strata?" "level?"
      if (terrainMapKey == previousKey) {
        colour = terrainMap[terrainMapKey];
      } else {
        colour = [21, 21, 18];
      }

      setBufferColourAtPosition(buffer, colour, x, y, size);

      previousKey = terrainMapKey;
    }
  }
}

function getContourMap(buffer, size, dsMap, falloffMap)
{
  var previousKey = 0.05;

  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      var DSvalue = clamp(dsMap[x][y] - falloffMap[x][y], 0.0, 1.0);

      var terrainMapKey = getTerrainMapKey(DSvalue);

      var colour = [];

      // If this is a new "strata?" "level?"
      if (terrainMapKey == previousKey) {
        colour = [217, 213, 184];
      } else {
        colour = [21, 21, 18];
      }

      setBufferColourAtPosition(buffer, colour, x, y, size);

      previousKey = terrainMapKey;
    }
  }
}

function getColourMap(buffer, size, dsMap, falloffMap) {
  var colour = [31, 3, 168];
  var terrainMapKey = 0.05;

  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      // Map the noise values generated by the Diamond-Square algorithm to rgb colours
      var DSvalue = clamp(dsMap[x][y] - falloffMap[x][y], 0.0, 1.0);

      terrainMapKey = getTerrainMapKey(DSvalue);

      colour = terrainMap[terrainMapKey];

      setBufferColourAtPosition(buffer, colour, x, y, size);
    }
  }
}

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
