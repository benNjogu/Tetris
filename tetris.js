const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

const ROW = 20;
const COL = (COLUMN = 10);
const SQ = (SquareSize = 20);
const VACANT = "WHITE"; //Color of an empty square

function drawSquare(x, y, color) {
  //draw a square
  ctx.fillStyle = color;
  ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

  ctx.strokeStyle = "BLACK";
  ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

//create the board
let board = [];
for (let r = 0; r < ROW; r++) {
  board[r] = [];
  for (let c = 0; c < COL; c++) {
    board[r][c] = VACANT;
  }
}

//draw the board
function drawBoard() {
  for (let r = 0; r < ROW; r++) {
    for (let c = 0; c < COL; c++) {
      drawSquare(c, r, board[r][c]);
    }
  }
}

drawBoard();

//The pieces and their colors
const PIECES = [
  [Z, "red"],
  [S, "green"],
  [T, "yellow"],
  [O, "blue"],
  [L, "purple"],
  [I, "cyan"],
  [J, "orange"],
];

//generate random pieces
function randomPiece() {
  let r = (randomN = Math.floor(Math.random() * PIECES.length)); //returns numbers btn 0 and 6
  return new Piece(PIECES[r][0], PIECES[r][1]);
}

//Instantiate the piece
let p = randomPiece();

//The object piece
function Piece(tetromino, color) {
  this.tetromino = tetromino;
  this.color = color;

  this.tetrominoN = 0; //We start from the first pattern
  this.activeTetromino = this.tetromino[this.tetrominoN];

  //we need to control the pieces
  this.x = 2;
  this.y = 4;
}

//fill function
Piece.prototype.fill = function (color) {
  for (let r = 0; r < this.activeTetromino.length; r++) {
    for (let c = 0; c < this.activeTetromino.length; c++) {
      //we draw only occupied squares
      if (this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, color);
      }
    }
  }
};

//draw a piece to the board
Piece.prototype.draw = function () {
  this.fill(this.color);
};

//Undraw a piece
Piece.prototype.unDraw = function () {
  this.fill(VACANT);
};

//Move down the piece
Piece.prototype.moveDown = function () {
  if (!this.collision(0, 1, this.activeTetromino)) {
    this.unDraw();
    this.y++;
    this.draw();
  } else {
    //lock the piece and generate a new one
    p = randomPiece();
  }
};

//Move the piece right
Piece.prototype.moveRight = function () {
  if (!this.collision(1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x++;
    this.draw();
  }
};

//Move the piece left
Piece.prototype.moveLeft = function () {
  if (!this.collision(-1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x--;
    this.draw();
  }
};

//Rotate the piece
Piece.prototype.rotate = function () {
  let nextPattern =
    this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];

  let kick = 0;
  if (this.collision(0, 0, nextPattern)) {
    if (this.x > COL / 2) {
      //it's the right wall
      kick = -1; //we need to move the piece to the left
    } else {
      //it's the right wall
      kick = 1; //we need to move the piece to the right
    }
  }

  if (!this.collision(kick, 0, nextPattern)) {
    this.unDraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length; //(0 + 4) % 4 => 1;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
};

//lock the pieces to the bottom
Piece.prototype.lock = function () {
  for (let r = 0; r < this.activeTetromino.length; r++) {
    for (let c = 0; c < this.activeTetromino.length; c++) {
      //we skip the vacant squares
      if (this.activeTetromino[r][c]) {
        continue;
      }
      //pieces to lock on game = gameover
      if (this.y + r < 0) {
        alert("Game Over");
        gameOver = true;
        break;
      }
    }
  }
};

//collision function
Piece.prototype.collision = function (x, y, piece) {
  for (let r = 0; r < piece.length; r++) {
    for (let c = 0; c < piece.length; c++) {
      //if the square is empty, we skip it
      if (!piece[r][c]) {
        continue;
      }
      //coordinate of the piece after the movement
      let newX = this.x + c + x;
      let newY = this.y + r + y;
      //Conditions
      if (newX < 0 || newX >= COL || newY >= ROW) {
        return true;
      }
      //skip newY < 0; board[-1] will crash our game
      if (newY < 0) {
        continue;
      }
      //Check if there is a locked piece on the board
      if (board[newY][newX] != VACANT) {
        return true;
      }
    }
  }

  return false;
};

//Control the piece
document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
  if (event.keyCode == 37) {
    p.moveLeft();
    dropStart = Date.now();
  } else if (event.keyCode == 38) {
    p.rotate();
    dropStart = Date.now();
  } else if (event.keyCode == 39) {
    p.moveRight();
    dropStart = Date.now();
  } else if (event.keyCode == 40) {
    p.moveDown();
    dropStart = Date.now();
  }
}

//draw the piece every one second
let dropStart = Date.now();
let gameOver = false;

function drop() {
  let now = Date.now();
  let delta = now - dropStart;
  if (delta > 1000) {
    p.moveDown();
    dropStart = Date.now();
  }
  if (!gameOver) {
    requestAnimationFrame(drop);
  }
}

drop();
