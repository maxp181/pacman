var game, CELLSIZE;

function setup() {
  createCanvas(520, 580);
  rectMode(CENTER);
  CELLSIZE = 20;
  game = createGame();
  frameRate(5);
}

function draw() {
  // UPDATE GAME
  game.update();
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


function gameOver() {

}
