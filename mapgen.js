class Cell {
  constructor(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
  }
}

class DS{
  constructor(grid, highest, lowest) {
    this.grid = grid
    this.highest = highest
    this.lowest = lowest
  }
}

var terrainMap = new Map()
// Deep Ocean
terrainMap[15] = [31, 3, 168]
// Ocean
terrainMap[30] = [15, 144, 199]
// Beach/Shore
terrainMap[38] = [217, 219, 141]
// Lowest/grassland/forest/etc
terrainMap[45] = [99, 196, 0]
// Low/grassland/forest/etc
terrainMap[55] = [0, 127, 20]
// Hills/rocky/high terrain
terrainMap[70] = [100, 82, 29]
// Mountains/highest terrain
terrainMap[85] = [100, 83, 64]

function diamondSquare(DATA_SIZE, heightoffset) {

  // Create an empty grid
	var data = new Array(DATA_SIZE);
	for (var i = 0; i < DATA_SIZE; i++) {
		data[i] = new Array(DATA_SIZE);

    for (var j = 0; j < DATA_SIZE; j++) {
      data[i][j] = 0;
    }
	}

  var highest = 0
  var lowest = 1000

	// Seed the data
  var SEED = 128.0;
	data[0][0] = data[0][DATA_SIZE - 1] = data[DATA_SIZE - 1][0] = data[DATA_SIZE -1][DATA_SIZE - 1] = SEED;

  // This iterates the algorithm (based on smoothness), increasing the "depth"
	for (var sideLength = DATA_SIZE - 1; sideLength >= 2; sideLength /= 2, heightoffset /= 2.0) {
		var halfSide = sideLength / 2;

    // SQUARE
		for (var x = 0; x < DATA_SIZE - 1; x += sideLength) {
		    for (var y = 0; y < DATA_SIZE - 1; y += sideLength) {

            // Get the average of the four surrounding corners
		        var avg = data[x][y] +
                data[x + sideLength][y] +
                data[x][y + sideLength] +
                data[x + sideLength][y + sideLength];
		        avg /= 4.0;

            if (avg < lowest) lowest = avg
            if (avg > highest) highest = avg

            // Set the square value to the average + a random number affected by the smoothness
		        data[x + halfSide][y + halfSide] = avg + (Math.random() * 2 * heightoffset) - heightoffset;
		    }
		}

    // DIAMOND
		for (var x = 0; x < DATA_SIZE - 1; x += halfSide) {
		    for (var y = (x + halfSide) % sideLength; y < DATA_SIZE - 1; y += sideLength) {

            // Get the average of the four points on the diamond
		        var avg =
                    data[(x - halfSide + DATA_SIZE - 1) % (DATA_SIZE - 1)][y] +
                    data[(x + halfSide) % (DATA_SIZE - 1)][y] +
                    data[x][(y + halfSide) % (DATA_SIZE - 1)] +
                    data[x][(y - halfSide + DATA_SIZE - 1) % (DATA_SIZE - 1)];
		        avg /= 4.0;

		        avg = avg + (Math.random() * 2 * heightoffset) - heightoffset;
		        data[x][y] = avg;

            if (avg < lowest) lowest = avg
            if (avg > highest) highest = avg

            // Wrap the values
		        if (x == 0) data[DATA_SIZE - 1][y] = avg;
		        if (y == 0) data[x][DATA_SIZE - 1] = avg;
		    }
		}
	}

	return new DS(data, highest, lowest);
}

function getGrid(size, heightoffset) {
  var grid = new Array(size)
  var data = diamondSquare(size, heightoffset)

  for (var x = 0; x < size; x++) {
    grid[x] = new Array(size)

    for (var y = 0; y < size; y++) {
      var colour = []

      // Map the noise values generated by the Diamond-Square algorithm to rgb colours
      var DSvalue = data.grid[x][y]

      for (var key in terrainMap) {
        if (terrainMap.hasOwnProperty(key)) {

          var percentileValue = getPercentileValue(key, data.highest, data.lowest)
          if (DSvalue > percentileValue) {
            var value = terrainMap[key]
            colour = value
          }
        }
      }
      grid[x][y] = new Cell(colour[0], colour[1], colour[2])
    }
  }

  return grid
}

function getPercentileValue(percent, highest, lowest) {
  return ((highest/100)*percent) + lowest
}
