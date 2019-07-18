// distance: number of pixels a puzzle piece will move
const DISTANCE = 100;
let xValue = 0;
let yValue = 0;
/**********************************
// STEP 1 - Create puzzlePieces data structure.
// I suggest using an array of objects but feel free to change that
// An example of a puzzle piece object could be: { name: ".box1", x: 0, y: 0 }
**********************************/
//Array Variables for puzzle pieces and another one to check for winner in isFinished fucntion
const puzzlePieces = [];
const comapredResult = [];

//Selecting all divs
const piecesData = document.querySelectorAll("div");

//Adding the pieces to puzzlepieces array
for (i = 0; i < piecesData.length; i++) {
  if (i < 4) {
    let piece = "." + piecesData[i].className;
    puzzlePieces.push({ name: piece, x: xValue, y: yValue });
    comapredResult.push(`${xValue} ${yValue}`);
    xValue = xValue + 100;
  } else if (i >= 4 && i <= 7) {
    if (i == 4) xValue = 0;
    yValue = 100;
    let piece = "." + piecesData[i].className;
    puzzlePieces.push({ name: piece, x: xValue, y: yValue });
    comapredResult.push(`${xValue} ${yValue}`);
    xValue = xValue + 100;
  } else if (i >= 8 && i <= 11) {
    if (i == 8) xValue = 0;
    yValue = 200;
    let piece = "." + piecesData[i].className;
    puzzlePieces.push({ name: piece, x: xValue, y: yValue });
    comapredResult.push(`${xValue} ${yValue}`);
    xValue = xValue + 100;
  } else if (i >= 12 && i <= 15) {
    if (i == 12) xValue = 0;
    yValue = 300;
    let piece = "." + piecesData[i].className;
    puzzlePieces.push({ name: piece, x: xValue, y: yValue });
    comapredResult.push(`${xValue} ${yValue}`);
    xValue = xValue + 100;
  }
}

// blankSpace: initialize blank square as last piece so as to remember where it is.
// Will eventually use it to ask direction of clicked puzzle piece(s).
// Once pieces move, must remember to update x,y values to new blank space coords
const blankSpace = { x: 300, y: 300, order: 16 };

// I'm structuring my program sort of like how Vue does it - all in my puzzle object below.
const puzzle = {
  pieces: puzzlePieces,
  distance: DISTANCE,
  blankSpace,
  currentPiece: null,
  directionToMove: "",
  initialize: function() {
    /************************************     
    // STEP 2 - Implement initialize function such that it
    // attache click event handlers for each piece
    // and within that, invokes the slide function
    ***************************************/
    piecesData.forEach(element => {
      element.addEventListener("click", e => {
        this.currentPiece = e.target;
        this.slide();
      });
      element.addEventListener("webkitTransitionEnd", this.isFinished);
    });
    // show puzzle pieces
    this.display();
  },
  display: function() {
    // initialize pieces to their proper order
    this.pieces.forEach(piece => {
      const pieceDOM = document.querySelector(piece.name);
      TweenLite.set(pieceDOM, { x: piece.x, y: piece.y });
    });
  },
  slide: function() {
    // call isMoveable to find out direction to move
    this.directionToMove = this.isMoveable();
    // remember to adjust coordinates including adjusting blank piece's coordinates
    /************************************
    // STEP 4 - Implement slide function so that you set x,y coordinates of appropriate puzzle piece(s)
    *********************************/
    switch (this.directionToMove) {
      case "up":
        this.pieces[this.currentPiece.dataset.idx].y -= 100;
        blankSpace.y += 100;
        break;
      case "down":
        this.pieces[this.currentPiece.dataset.idx].y += 100;
        blankSpace.y -= 100;
        break;
      case "right":
        this.pieces[this.currentPiece.dataset.idx].x += 100;
        blankSpace.x -= 100;
        break;
      case "left":
        this.pieces[this.currentPiece.dataset.idx].x -= 100;
        blankSpace.x += 100;
        break;
    }
    //Creating new timeline to execute isfinished after animation ends
    var t1 = new TimelineMax();

    // v1.to(this.currentPiece, 0.17, {
    //   x: this.pieces[this.currentPiece.dataset.idx].x,
    //   y: this.pieces[this.currentPiece.dataset.idx].y,
    //   ease: Power0.easeNone
    // });
    // Now animate current puzzle piece now that x, y coordinates have been set above
    t1.to(this.currentPiece, 0.17, {
      x: this.pieces[this.currentPiece.dataset.idx].x,
      y: this.pieces[this.currentPiece.dataset.idx].y,
      ease: Power0.easeNone,
      //Binding is finished to puzzle object and executing it after animation completes
      onComplete: this.isFinished.bind(puzzle)
    });
  },
  isMoveable: function() {
    /********************************************
    // STEP 3 - Implement isMoveable function to find out / return which direction to move
    // Is the clicked piece movable?
    // If yes, then return a direction to one of: "up", "down", "left", "right"
    // If no, then return a direction of ""
     ******************************************/
    if (
      this.pieces[this.currentPiece.dataset.idx].y > blankSpace.y &&
      Math.abs(this.pieces[this.currentPiece.dataset.idx].y - blankSpace.y) ==
        100 &&
      this.pieces[this.currentPiece.dataset.idx].x == blankSpace.x
    )
      return "up";
    if (
      this.pieces[this.currentPiece.dataset.idx].y < blankSpace.y &&
      Math.abs(this.pieces[this.currentPiece.dataset.idx].y - blankSpace.y) ==
        100 &&
      this.pieces[this.currentPiece.dataset.idx].x == blankSpace.x
    )
      return "down";
    if (
      this.pieces[this.currentPiece.dataset.idx].x > blankSpace.x &&
      Math.abs(this.pieces[this.currentPiece.dataset.idx].x - blankSpace.x) ==
        100 &&
      this.pieces[this.currentPiece.dataset.idx].y == blankSpace.y
    )
      return "left";
    if (
      this.pieces[this.currentPiece.dataset.idx].x < blankSpace.x &&
      Math.abs(this.pieces[this.currentPiece.dataset.idx].x - blankSpace.x) ==
        100 &&
      this.pieces[this.currentPiece.dataset.idx].y == blankSpace.y
    )
      return "right";
    return "";

    //More than one piece
    // const index = this.currentPiece.dataset.idx;
    // if (
    //   this.pieces[index].x === this.blankSpace.x &&
    //   this.pieces[index].y > this.blankSpace.y
    // ) {
    //   return "up";
    // } else if (
    //   this.pieces[index].x === this.blankSpace.x &&
    //   this.pieces[index].y < this.blankSpace.y
    // ) {
    //   return "down";
    // } else if (
    //   this.pieces[index].y === this.blankSpace.y &&
    //   this.pieces[index].x < this.blankSpace.x
    // ) {
    //   return "right";
    // } else if (
    //   this.pieces[index].y === this.blankSpace.y &&
    //   this.pieces[index].x > this.blankSpace.x
    // ) {
    //   return "left";
    // } else {
    //   return "";
    // }
  },
  //Funtion to check if the puzzle is solved and display winner alert
  isFinished: function() {
    let result = [];
    this.pieces.forEach(element => {
      result.push(`${element.x} ${element.y}`);
    });
    if (comapredResult.every(e => result.includes(e))) {
      alert("Winner!");
    }
  }
};

//Initializing the puzzle
puzzle.initialize();