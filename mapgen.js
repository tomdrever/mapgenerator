class Cell {
  constructor(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
  }
}

function diamondSquare(DATA_SIZE) {
	//DATA_SIZE is the size of grid to generate, note this must be a
	//value 2^n+1


	//an initial seed value for the corners of the data
	var SEED = 128.0;
	var data = new Array(DATA_SIZE);
	for (var i = 0; i < DATA_SIZE; i++) {
		data[i] = new Array(DATA_SIZE);

    for (var j = 0; j < DATA_SIZE; j++) {
      data[i][j] = 0;
    }
	}
	//seed the data
	data[0][0] = data[0][DATA_SIZE - 1] = data[DATA_SIZE - 1][0] = data[DATA_SIZE - 1][DATA_SIZE - 1] = SEED;

	var h = 128.0;//the range (-h -> +h) for the average offset

	//side length is distance of a single square side
	//or distance of diagonal in diamond
	for (var sideLength = DATA_SIZE - 1;
		//side length must be >= 2 so we always have
		//a new value (if its 1 we overwrite existing values
		//on the last iteration)
        sideLength >= 2;
		//each iteration we are looking at smaller squares
		//diamonds, and we decrease the variation of the offset
        sideLength /= 2, h /= 2.0) {
		//half the length of the side of a square
		//or distance from diamond center to one corner
		//(just to make calcs below a little clearer)
		var halfSide = sideLength / 2;

		//generate the new square values
		for (var x = 0; x < DATA_SIZE - 1; x += sideLength) {
		    for (var y = 0; y < DATA_SIZE - 1; y += sideLength) {
		        //x, y is upper left corner of square
		        //calculate average of existing corners
		        var avg = data[x][y] + //top left
                data[x + sideLength][y] +//top right
                data[x][y + sideLength] + //lower left
                data[x + sideLength][y + sideLength];//lower right
		        avg /= 4.0;

		        //center is average plus random offset
		        data[x + halfSide][y + halfSide] = avg + (Math.random() * 2 * h) - h;
                //We calculate random value in range of 2h
                //and then subtract h so the end value is
                //in the range (-h, +h)

		    }
		}

		//generate the diamond values
		//since the diamonds are staggered we only move x
		//by half side
		//NOTE: if the data shouldn't wrap then x < DATA_SIZE
		//to generate the far edge values
		for (var x = 0; x < DATA_SIZE - 1; x += halfSide) {
		    //and y is x offset by half a side, but moved by
		    //the full side length
		    //NOTE: if the data shouldn't wrap then y < DATA_SIZE
		    //to generate the far edge values
		    for (var y = (x + halfSide) % sideLength; y < DATA_SIZE - 1; y += sideLength) {
		        //x, y is center of diamond
		        //note we must use mod  and add DATA_SIZE for subtraction
		        //so that we can wrap around the array to find the corners
		        var avg =
                    data[(x - halfSide + DATA_SIZE - 1) % (DATA_SIZE - 1)][y] + //left of center
                    data[(x + halfSide) % (DATA_SIZE - 1)][y] + //right of center
                    data[x][(y + halfSide) % (DATA_SIZE - 1)] + //below center
                    data[x][(y - halfSide + DATA_SIZE - 1) % (DATA_SIZE - 1)]; //above center

		        avg /= 4.0;

		        //new value = average plus random offset
		        //We calculate random value in range of 2h
		        //and then subtract h so the end value is
		        //in the range (-h, +h)
		        avg = avg + (Math.random() * 2 * h) - h;
		        //update value for center of diamond
		        data[x][y] = avg;

		        //wrap values on the edges, remove
		        //this and adjust loop condition above
		        //for non-wrapping values.
		        if (x == 0) data[DATA_SIZE - 1][y] = avg;
		        if (y == 0) data[x][DATA_SIZE - 1] = avg;
		    }
		}
	}

	//return the data
	return data;

}

function getGrid(size) {
  var grid = new Array(size)
  var data = diamondSquare(size)

  for (var x = 0; x < size; x++) {
    grid[x] = new Array(size)

    for (var y = 0; y < size; y++) {
      var color = []

      var datanum = data[x][y]
      if (datanum < 70) {
        color = [25, 25, 255]
      } else if (datanum < 100 && datanum >= 70) {
        color = [76, 166, 255]
      } else if (datanum < 120 && datanum >= 100) {
        color = [255, 255, 102]
      } else if (datanum < 150 && datanum >= 120) {
        color = [50, 215, 50]
      } else if (datanum < 180 && datanum >= 150) {
        color = [0, 123, 0]
      } else if (datanum < 210 && datanum >= 180) {
        color = [49, 49, 28]
      } else {
        color = [38,38,38]
      }

      grid[x][y] = new Cell(color[0], color[1], color[2])
    }
  }

  return grid
}
