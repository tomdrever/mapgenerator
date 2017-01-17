class Cell {
  constructor(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
  }
}

function getGrid(size) {
  var grid = new Array(size)

  for (var x = 0; x < size; x++) {
    grid[x] = new Array(size)

    for (var y = 0; y < size; y++) {
      grid[x][y] = new Cell(random(1, 255), random(1, 255), random(1, 255))
    }
  }

  return grid
}
