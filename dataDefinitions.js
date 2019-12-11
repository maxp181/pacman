/* (define-struct configuration [width height board start dots powers ghost-starts])

A Configuration is a new Configuration(Number, Number, Board, Posn, [List-of Posn], [List-of Posn], [List-of Posn])
Interpretation: A game configuration, where:
 - width is the width of the board (number of cells),
 - height is the height of the board (number of cells),
 - board is the board itself (which contains information about every cell on the board),
 - start is pacman's initial location (cell position),
 - dots provides the locations of dots,
 - powers provides the locations of power pellets, and
 - ghostStarts provides a list of the starting locations for ghosts. */
class Configuration {
    constructor(width, height, board, start, dots, powers, ghostStarts) {
        this.width = width;
        this.height = height;
        this.board = board;
        this.start = start;
        this.dots = dots;
        this.powers = powers;
        this.ghostStarts = ghostStarts;

        this.drawDots = function (type) {
            if (type === "dot") {
                for (var i = 0; i < this.dots.length; i++) {
                    this.dots[i].draw("dot");
                }
            }
            else if (type === "power") {
                for (var i = 0; i < this.powers.length; i++) {
                    this.powers[i].draw("power");
                }
            }
        };
    }
}

/* A Posn is a new Posn(Natural, Natural)
Interpretation: A cartesian point, where (0, 0) is in the upper-left hand corner */
class Posn {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.draw = function (type) {
            noStroke();
            var cent = gridToCenterPx(new Posn(this.x, this.y));
            fill(255, 245, 207);
            if (type === "dot") {
                circle(cent.x, cent.y, 5);
            }
            else if (type === "power") {
                circle(cent.x, cent.y, 12);
            }
        };

        this.update = function (direction, width, height) {
            switch (direction) {
                case "left":
                    this.x = (this.x - 1 + width) % width;
                    break;
                case "right":
                    this.x = (this.x + 1) % width;
                    break;
                case "up":
                    this.y = (this.y - 1 + height) % height;
                    break;
                case "down":
                    this.y = (this.y + 1) % height;
                    break;
                case "":
                    break;
            }
        };
    }
}

/* A Board is a [List-of Cell]
Interpretation: A list of cells on the board. */

/* (define-struct pair [position walls])

A Cell is a new Cell(Posn, [List-of Dir])
Interpretation: Tracks information for a cell, where:
- position represents the cell's location (cell position), and
- walls represents all the walls adjacent to the cell. */
class Cell {
    constructor(position, walls) {
        this.position = position;
        this.walls = walls;

        this.draw = function () {
            var cent = gridToCenterPx(this.position);
            var x1, x2, y1, y2;
            push();
            for (var i = 0; i < this.walls.length; i++) {
                strokeWeight(2);
                stroke(25, 25, 166);
                switch (this.walls[i]) {
                    case "left":
                        x1 = cent.x - CELLSIZE / 2.0;
                        x2 = cent.x - CELLSIZE / 2.0;
                        y1 = cent.y - CELLSIZE / 2.0;
                        y2 = cent.y + CELLSIZE / 2.0;
                        break;
                    case "right":
                        x1 = cent.x + CELLSIZE / 2.0;
                        x2 = cent.x + CELLSIZE / 2.0;
                        y1 = cent.y - CELLSIZE / 2.0;
                        y2 = cent.y + CELLSIZE / 2.0;
                        break;
                    case "up":
                        x1 = cent.x - CELLSIZE / 2.0;
                        x2 = cent.x + CELLSIZE / 2.0;
                        y1 = cent.y - CELLSIZE / 2.0;
                        y2 = cent.y - CELLSIZE / 2.0;
                        break;
                    case "down":
                        x1 = cent.x - CELLSIZE / 2.0;
                        x2 = cent.x + CELLSIZE / 2.0;
                        y1 = cent.y + CELLSIZE / 2.0;
                        y2 = cent.y + CELLSIZE / 2.0;
                        break;
                    case "special":
                        x1 = cent.x - CELLSIZE / 2.0;
                        x2 = cent.x + CELLSIZE / 2.0;
                        y1 = cent.y - CELLSIZE / 2.0;
                        y2 = cent.y - CELLSIZE / 2.0;
                        strokeWeight(1);
                        stroke(255);
                        break;
                }
                line(x1, y1, x2, y2);
            }
            pop();
        };
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

        this.draw = function () {
            fill(255, 255, 0);
            var cent = gridToCenterPx(this.position);
            circle(cent.x, cent.y, 16);
            //mouth
            if (this.mouth) {
                fill(0);
                switch (this.direction) {
                    case "left":
                        arc(cent.x, cent.y, 16, 16, (5.0 / 6.0) * PI, (7.0 / 6.0) * PI);
                        break;
                    case "down":
                        arc(cent.x, cent.y, 16, 16, PI / 3.0, (2.0 / 3.0) * PI);
                        break;
                    case "right":
                        arc(cent.x, cent.y, 16, 16, (11.0 / 6.0) * PI, PI / 6.0);
                        break;
                    case "up":
                        arc(cent.x, cent.y, 16, 16, (4.0 / 3.0) * PI, (5.0 / 3.0) * PI);
                        break;
                }
            }
        };

        this.canMove = function (gc) {
            var currentCell = getCell(this.position, gc.board);
            return (!currentCell.walls.includes(this.direction));
        }

        this.update = function (gc) {
            if (this.canMove(gc)) { //can move
                this.mouth = !this.mouth; //change mouth
                this.position.update(this.direction, gc.width, gc.height); //move
            }

        };
    }
}

/* (define-struct ghost [type direction position frightened scatter timer])

A Ghost is a new Ghost(String, Dir, Posn, Nat, Boolean, Nat)
Interpretation: The state of a ghost, where:
 - type represents the type of the ghost ("blinky", "pinky", "inky", or "clyde")
 - direction represents the direction of the ghost (up/down/left/right)
 - position is the position of the ghost on the board
 - frightened represents whether a ghost is frightened (n > 0) or not (n = 0)
 - scatter represents the mode of a ghost, #true for scatter and #false for chase, and
 - timer represents the timer of how long the ghost has been in that mode. */
class Ghost {
    constructor(type, direction, position, frightened, scatter, timer) {
        this.type = type;
        this.direction = direction;
        this.position = position;
        this.frightened = frightened;
        this.scatter = scatter;
        this.timer = timer;

        this.draw = function () {
            //COLOR
            if (this.frightened > 0) {
                fill(0, 0, 255);
            }
            else {
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
            }
            //BODY
            var cent = gridToCenterPx(this.position);
            rect(cent.x, cent.y, CELLSIZE * 0.75, CELLSIZE * 0.8, CELLSIZE / 2.0, CELLSIZE / 2.0, 0, 0);
            //SPIKES
            fill(0);
            triangle(cent.x - CELLSIZE * 0.13, cent.y + CELLSIZE * 0.4, cent.x + CELLSIZE * 0.13, cent.y + CELLSIZE * 0.4, cent.x, cent.y + CELLSIZE * 0.2);
            triangle(cent.x - CELLSIZE * 0.37, cent.y + CELLSIZE * 0.4, cent.x - CELLSIZE * 0.13, cent.y + CELLSIZE * 0.4, cent.x - CELLSIZE * 0.25, cent.y + CELLSIZE * 0.2);
            triangle(cent.x + CELLSIZE * 0.13, cent.y + CELLSIZE * 0.4, cent.x + CELLSIZE * 0.37, cent.y + CELLSIZE * 0.4, cent.x + CELLSIZE * 0.25, cent.y + CELLSIZE * 0.2);
            //EYES
            fill(255);
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
                case "":
                    //translate(-CELLSIZE * 0.15, -CELLSIZE * 0.075);
                    translate(-CELLSIZE * 0.15, -CELLSIZE * 0.139);
                    break;
            }
            fill(0, 0, 255);
            circle(cent.x, cent.y, CELLSIZE * 0.1);
            circle(cent.x + CELLSIZE * 0.3, cent.y, CELLSIZE * 0.1);
            pop();
        };

        this.update = function (pacman, gc) {
            //update direction
            var goal;
            var currentCell = getCell(this.position, gc.board);
            var allDirections = ["left", "right", "up", "down"];
            var possibleDirections = [];
            for (var i = 0; i < allDirections.length; i++) {
                var direction = allDirections[i];
                if ((!(direction === reverseDirection(this.direction)))
                    && (!(currentCell.walls.includes(direction)))) {
                    possibleDirections.push(allDirections[i]);
                }
            }

            //if in box
            if (this.position.x >= 9 && this.position.x <= 16 &&
                this.position.y >= 12 && this.position.x <= 15) {
                goal = new Posn(12, 11);
            } else if (this.scatter) { //scatter mode
                switch (this.type) {
                    case "blinky":
                        goal = new Posn(0, 0);
                        break;
                    case "pinky":
                        goal = new Posn(gc.width - 1, 0);
                        break;
                    case "inky":
                        goal = new Posn(0, gc.height - 1);
                        break;
                    case "clyde":
                        goal = new Posn(gc.width - 1, gc.height - 1);
                        break;
                }
            } else { //chase mode
                switch (this.type) {
                    case "blinky":
                        goal = new Posn(pacman.position.x, pacman.position.y)
                        break;
                    case "pinky":
                        goal = new Posn(pacman.position.x, pacman.position.y);
                        goal.update(pacman.direction, gc.width, gc.height);
                        goal.update(pacman.direction, gc.width, gc.height);
                        goal.update(pacman.direction, gc.width, gc.height);
                        goal.update(pacman.direction, gc.width, gc.height);
                        break;
                    case "inky":
                        goal = new Posn(pacman.position.x, pacman.position.y)
                        goal.update(reverseDirection(pacman.direction), gc.width, gc.height);
                        goal.update(reverseDirection(pacman.direction), gc.width, gc.height);
                        goal.update(reverseDirection(pacman.direction), gc.width, gc.height);
                        goal.update(reverseDirection(pacman.direction), gc.width, gc.height);
                        break;
                    case "clyde":
                        if (dist(this.position.x, this.position.y, pacman.position.x, pacman.position.y) > 8) {
                            goal = new Posn(pacman.position.x, pacman.position.y)
                        } else {
                            goal = new Posn(gc.width - 1, gc.height - 1);
                        }
                        break;
                }
            }
            this.direction = this.pickNewDirection(goal, possibleDirections, gc);
            //move
            this.position.update(this.direction, gc.width, gc.height);
            //clock
            if (this.scatter && (this.timer >= GHOSTSCATTERTIME)) {
                this.frightened = max(0, this.frightened - 0.5);
                this.scatter = false;
                this.timer = 0;
            } else if (!this.scatter && (this.timer >= GHOSTCHASETIME)) {
                this.frightened = max(0, this.frightened - 0.5);
                this.scatter = true;
                this.timer = 0;
            } else {
                this.frightened = max(0, this.frightened - 0.5);
                this.timer += 1;
            }
        };

        //picks direction which minimizes distance to goal
        this.pickNewDirection = function (goal, possibleDirections, gc) {
            var min = this.distanceToGoal(goal, possibleDirections[0], gc);
            var minIndex = 0;
            var distance;

            for (var i = 1; i < possibleDirections.length; i++) {
                distance = this.distanceToGoal(goal, possibleDirections[i], gc)
                if (distance < min) {
                    minIndex = i;
                    min = distance;
                }
            }
            return possibleDirections[minIndex];
        };

        //finds distance to goal if move in given direction
        this.distanceToGoal = function (goal, direction, gc) {
            var newPosition = new Posn(this.position.x, this.position.y);
            newPosition.update(direction, gc.width, gc.height);
            return dist(newPosition.x, newPosition.y, goal.x, goal.y);
        };
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
        this.score = 0;

        this.draw = function () {
            // DRAW BOARD
            drawBoard(this.gc.board, this.gc.width, this.gc.height);
            // DRAW STARTER TEXT
            if (this.pacman.direction === "" && this.pacman.lives > 0) {
                textSize(25);
                fill(255, 255, 0);
                text("Ready!", width / 2, height / 2 - 72.5);
            }
            // DRAW DOTS, PACMAN, AND GHOSTS
            this.gc.drawDots("dot");
            this.gc.drawDots("power");
            this.pacman.draw();
            drawGhosts(this.ghosts);

            // DRAW LIVES
            push();
            var lives = this.pacman.lives;
            var standardPac = new Pacman(true, "left", new Posn(1, 29), 3);
            while (lives > 0) {
                standardPac.draw();
                translate(25, 0);
                lives --;
            }
            pop();
            // DRAW SCORE
            textSize(18);
            stroke(255);
            text("Score: " + this.score, width / 2, height - 4);
        };

        this.update = function () {
            // CHECK COLLISIONS BEFORE MOVING
            checkCollisions(this.pacman, this.ghosts, this.gc);

            var currentGhosts = this.ghosts;
            var currentPos = pacman.position;

            // UPDATE
            if (this.pacman.direction != "") {
                updateGhosts(this.ghosts, this.pacman, this.gc);
                //checkCollisions(this.pacman, this.ghosts, this.gc);
            }
            this.pacman.update(this.gc);

            // CHECK IF PACMAN AND GHOST PASSED EACH OTHER
            
            //checkCollisions(this.pacman, this.ghosts, this.gc.dots, this.gc.powers, this.gc.ghostStarts, this.gc.start);
            
        };
    }
}

