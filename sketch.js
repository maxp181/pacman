var game, CELLSIZE, GHOSTSCATTERTIME, GHOSTCHASETIME, gameOver;

function setup() {
  createCanvas(520, 580);
  rectMode(CENTER);
  frameRate(5);
  CELLSIZE = 20;
  GHOSTSCATTERTIME = 5;
  GHOSTCHASETIME = 20;
  game = createGame();
}

function draw() {
  // UPDATE GAME
  game.update();
  gameOver = gameOver(game);
  console.log(gameOver);
  // DRAW GAME
  game.draw();
}

function keyPressed() {
  var direction = "";
  switch (keyCode) {
    case LEFT_ARROW:
      direction = "left";
      break;
    case RIGHT_ARROW:
        direction = "right";
        break;
    case UP_ARROW:
        direction = "up";
        break;
    case DOWN_ARROW:
        direction = "down";
        break; 
  }
  var pacman = game.pacman;
  //new pacman with new direction
  var newPacman = new Pacman(pacman.mouth, direction, pacman.position, pacman.lives);
  if (newPacman.canMove(game.gc)) {
    game.pacman.direction = direction;
  }
}

// gameOver : PacmanGame -> Number
// determines if the game is over: 0 = not, 1 = win, -1 = lose
function gameOver(game) {
  if (game.pacman.lives === 0) {
    return -1;
  } else if (game.gc.dots.length === 0 && game.gc.powers.length === 0) {
    return 1;
  } else {
    return 0;
  }
}
