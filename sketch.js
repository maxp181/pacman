var game, CELLSIZE, GHOSTSCATTERTIME, GHOSTCHASETIME, gameState;

function setup() {
  createCanvas(520, 600);
  rectMode(CENTER);
  frameRate(1);
  textFont('Georgia');
  textAlign(CENTER);
  CELLSIZE = 20;
  GHOSTSCATTERTIME = 5;
  GHOSTCHASETIME = 20;
  game = createGame();
  gameState = 0;
}

function draw() {
  noStroke();
  // UPDATE GAME
  //console.log(gameState);
  gameState = gameOver(game);
  if (gameState === 0) {
    game.update();
  
  }


  // DRAW LIVES
  fill(0);
  rect(width / 2, height - 20, width, 40);
  // DRAW GAME


  game.draw();
  textSize(25);
  if (gameState === 1) {
    fill(255, 255, 0);
    text("You Win!", width / 2, height / 2 - 72.5);
  } else if (gameState === -1) {
    fill(255, 255, 0);
    text("Game Over", width / 2, height / 2 - 72.5);
  }

  
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
