/* (define-struct configuration [width height board start dots powers ghost-starts])

A Configuration is a new Configuration(Number, Number, Board, Posn, [List-of Posn], [List-of Posn], [List-of Posn])
Interpretation: A game configuration, where:
 - width is the width of the board (number of cells),
 - height is the height of the board (number of cells),
 - board is the board itself (which contains information about every cell on the board),
 - start is pacman's initial location (cell position),
 - dots provides the locations of dots,
 - powers provides the locations of power pellets, and
 - ghost-starts provides a list of the starting locations for ghosts. */
class Configuration {
  constructor(width, height, board, start, dots, powers, ghostStarts) {
    this.width = width;
    this.height = height;
    this.board = board;
    this.start = start;
    this.dots = dots;
    this.powers = powers;
    this.ghostStarts = ghostStarts;
  }

  drawDots(type) {
    for (var dot in this.dots) {
      dot.draw(type);
    }
  }
}

/* A Posn is a new Posn(Natural, Natural)
Interpretation: A cartesian point, where (0, 0) is in the upper-left hand corner */
class Posn {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  draw(type) {
    var cent = gridToCenterPx(new Posn(this.x, this.y));
    fill(255, 245, 207);
    if (type === "dot") {
      circle(cent.x, cent.y, 4);
    } else if (type === "power") {
      circle(cent.x, cent.y, 10);
    }
  }
}

/* A Board is a [List-of Cell]
Interpretation: A list of cells on the board. */

function drawBoard(listofCells, width, height) {
  //BACKGROUND
  fill(0);
  rect(width / 2.0 * CELLSIZE, height / 2.0 * CELLSIZE, width * CELLSIZE, height * CELLSIZE);
  //CELLS
  for (var cell in listofCells) {
    cell.draw();
  }
}

/* (define-struct pair [position walls])

A Cell is a new Cell(Posn, [List-of Dir])
Interpretation: Tracks information for a cell, where:
- position represents the cell's location (cell position), and
- walls represents all the walls adjacent to the cell. */
class Cell {
  constructor(position, walls) {
    this.position = position;
    this.walls = walls;
  }

  draw() {
    var cent = gridToCenterPx(this.position);
    var x1, x2, y1, y2;
    push();
    strokeWeight(2);
    stroke(25, 25, 166);
    for (var wall in this.walls) {
      switch (wall) {
        case "left":
          x1 = cent.x - CELLSIZE / 2.0;
          x2 = cent.x - CELLSIZE / 2.0;
          y1 = cent.y - CELLSIZE / 2.0;
          y1 = cent.y + CELLSIZE / 2.0;
          break;
        case "right":
            x1 = cent.x + CELLSIZE / 2.0;
            x2 = cent.x + CELLSIZE / 2.0;
            y1 = cent.y - CELLSIZE / 2.0;
            y1 = cent.y + CELLSIZE / 2.0;
          break;
        case "up":
            x1 = cent.x - CELLSIZE / 2.0;
            x2 = cent.x + CELLSIZE / 2.0;
            y1 = cent.y - CELLSIZE / 2.0;
            y1 = cent.y - CELLSIZE / 2.0;
          break;
        case "down":
            x1 = cent.x - CELLSIZE / 2.0;
            x2 = cent.x + CELLSIZE / 2.0;
            y1 = cent.y + CELLSIZE / 2.0;
            y1 = cent.y + CELLSIZE / 2.0;
          break;
      }
      line(x1, x2, y1, y2);
    }
    pop();
  }
}

/* A Dir is one of:
 - "up"
 - "down"
 - "left"
 - "right" */

/* (define-struct pacman [mouth direction position lives])

A Pacman is a new Pacman(Boolean, Dir, Posn, Natural)
Interpretation: The state of Pacman, where:
 - mouth represents the state of the mouth, whether it is open (#true) or closed (#false)
 - direction represents the direction of pacman (up/down/left/right)
 - position is the position of pacman on the board, and
 - lives is the number of lives that pacman has left. */
class Pacman {
  constructor(mouth, direction, position, lives) {
    this.mouth = mouth;
    this.direction = direction;
    this.position = position;
    this.lives = lives;
  }

  draw() {
    fill(255, 255, 0);
    var cent = gridToCenterPx(this.position);
    circle(cent.x, cent.y, 16);
    if (this.mouth) {
      push();
      switch (this.direction) {
        case "left":
          break;
        case "down":
          rotate(0.50 * PI);
          break;
        case "right":
          rotate(PI);
          break;
        case "up":
          rotate(1.50 * PI);
          break;
      }
      fill(0);
      arc(cent.x, cent.y, 8, 8, (5.0 / 6.0) * PI, (7.0 / 6.0) * PI);
      pop();
    }
  }
}

/* (define-struct ghost [type direction position frightened scatter timer])

A Ghost is a new Ghost(String, Dir, Posn, Nat, Boolean, Nat)
Interpretation: The state of a ghost, where:
 - type represents the type of the ghost ("blinky", "pinky", "inky", or "clyde")
 - direction represents the direction of the ghost (up/down/left/right)
 - position is the position of the ghost on the board
 - frightened represents whether a ghost is frightened (n > 0) or not (n = 0)
 - scatter? represents the mode of a ghost, #true for scatter and #false for chase, and
 - timer represents the timer of how long the ghost has been in that mode. */
class Ghost {
  constructor(type, direction, position, frightened, scatter, timer) {
    this.type = type;
    this.direction = direction;
    this.position = position;
    this.frightened = frightened;
    this.scatter = scatter;
    this.timer = timer;
  }

  draw() {
    //COLOR
    if (this.frightened > 0) {
      fill(0, 0, 255);
    } else {
      switch (this.type) {
        case "blinky":
          fill(255, 0, 0);
          break;
        case "pinky":
          fill(255, 184, 255);
          break;
        case "inky":
          fill(0, 255, 255);
          break;
        case "clyde":
          fill(255, 169, 48);
          break;
      }
      //BODY
      var cent = gridToCenterPx(this.position);
      rect(centx, centy, CELLSIZE * 0.75, CELLSIZE * 0.8, CELLSIZE / 2.0, CELLSIZE / 2.0, 0, 0);
    }
    //SPIKES
    fill(0);
    triangle(cent.x - CELLSIZE * 0.13, cent.y + CELLSIZE * 0.4,
      cent.x + CELLSIZE * 0.13, cent.y + CELLSIZE * 0.4,
      cent.x, cent.y + CELLSIZE * 0.2);

    triangle(cent.x - CELLSIZE * 0.37, cent.y + CELLSIZE * 0.4,
      cent.x - CELLSIZE * 0.13, cent.y + CELLSIZE * 0.4,
      cent.x - CELLSIZE * 0.25, cent.y + CELLSIZE * 0.2);

    triangle(cent.x + CELLSIZE * 0.13, cent.y + CELLSIZE * 0.4,
      cent.x + CELLSIZE * 0.37, cent.y + CELLSIZE * 0.4,
      cent.x + CELLSIZE * 0.25, cent.y + CELLSIZE * 0.2);
    //EYES
    ellipse(cent.x - CELLSIZE * 0.15, cent.y - CELLSIZE * 0.075, CELLSIZE * .175, CELLSIZE * .233);
    ellipse(cent.x + CELLSIZE * 0.15, cent.y - CELLSIZE * 0.075, CELLSIZE * .175, CELLSIZE * .233);
    //PUPILS
    push();
    switch (this.direction) {
      case "left":
        translate(-CELLSIZE * 0.188, -CELLSIZE * 0.075);
        break;
      case "right":
        translate(-CELLSIZE * 0.111, -CELLSIZE * 0.075);
        break;
      case "up":
        translate(-CELLSIZE * 0.15, -CELLSIZE * 0.139);
        break;
      case "down":
        translate(-CELLSIZE * 0.15, -CELLSIZE * 0.012);
        break;
    }
    circle(cent.x, cent.y, CELLSIZE * 0.1);
    pop();
  }
}

function drawGhosts(listOfGhosts) {
  for (var ghost in listOfGhosts) {
    ghost.draw();
  }
}

/* (define-struct game-of-pacman [pacman ghosts gc])

A GameOfPacman is a new PacmanGame(Pacman, [List-of Ghost], GameConfiguration)
Interpretation: The state of a pacman game, where
 - pacman is the pacman on the board
 - ghosts is the list of ghosts in the game, and
 - gc is the game configuration. */
class PacmanGame {
  constructor(pacman, ghosts, gc) {
    this.pacman = pacman;
    this.ghosts = ghosts;
    this.gc = gc;
  }

  draw() {
    drawBoard(this.gc.board, this.gc.width, this.gc.height);
    this.pacman.draw();
    drawGhosts(this.ghosts);
    this.gc.drawDots("dot");
    this.gc.drawDots("power");
  }
}