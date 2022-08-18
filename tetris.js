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
const PIECES = [[Z, "red"], [S, "green"], [T, "yellow"], [O, "blue"], [L, "purple"], [I, "cyan"], [J, "orange"]];

//Initiate the piece
let p = new Piece(PIECES[0][0], PIECES[0][1]);

//The object piece
function Piece(tetromino, color){
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;//We start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];

    //we need to control the pieces
    this.x = 2;
    this.y = 4;
}

//draw a piece to the board
Piece.prototype.draw = function(){
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        //we draw only occupied squares
        if(this.activeTetromino[r][c]){
            drawSquare(this.x + c, this.y + r, this.color)
        }
      }
    }
}

//Undraw a piece
Piece.prototype.unDraw = function () {
  for (let r = 0; r < this.activeTetromino.length; r++) {
    for (let c = 0; c < this.activeTetromino.length; c++) {
      //we draw only occupied squares
      if (this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, VACANT);
      }
    }
  }
};

//Move down the piece
Piece.prototype.moveDown = function(){
    this.unDraw();
    this.y++;
    this.draw();
}

//draw the piece every one second
let dropStart = Date.now();

function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    requestAnimationFrame(drop);
}

drop();

