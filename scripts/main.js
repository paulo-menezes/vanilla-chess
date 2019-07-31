// TODO: Pieces specific movements
// TODO: Timer
// TODO: Scores
// TODO: Responsiveness
// TODO: Background songs

function initialize() {
  const colors = ['rgba(226, 192, 140, 0.9)', 'rgba(88, 47, 27, 0.9)'];

  const whitePawn = 'svg/white_pawn.svg';
  const whitePieces = ['svg/white_rook.svg', 'svg/white_knight.svg',
    'svg/white_bishop.svg', 'svg/white_queen.svg', 'svg/white_king.svg',
    'svg/white_bishop.svg', 'svg/white_knight.svg', 'svg/white_rook.svg'
  ];

  const blackPawn = 'svg/black_pawn.svg';
  const blackPieces = [ 'svg/black_rook.svg', 'svg/black_knight.svg',
    'svg/black_bishop.svg', 'svg/black_queen.svg', 'svg/black_king.svg',
    'svg/black_bishop.svg', 'svg/black_knight.svg', 'svg/black_rook.svg'
  ];

  const content = document.querySelector('.content');

  let line = 1;
  let column = 0;
  let colorIndex = 0;

  for (let i = 1; i <= 64; i++) {
    const square = createSquare('square' + i, colors[colorIndex]);

    if (line === 1) {
      placePiece(square, whitePieces[column], 'white');
      column++;
    }

    if (line === 2) {
      placePiece(square, whitePawn, 'white');
    }

    if (line === 7) {
      placePiece(square, blackPawn, 'black');
    }

    if (line === 8) {
      placePiece(square, blackPieces[column], 'black');
      column++;
    }

    colorIndex = colorIndex > 0 ? colorIndex - 1 : colorIndex + 1;

    // when line changed
    if (i % 8 === 0) {
      line++;
      column = 0;
      colorIndex = colorIndex > 0 ? colorIndex - 1 : colorIndex + 1;
    }

    content.appendChild(square);
  }
}

function allowDrop(e) {
  e.preventDefault();
}

function createSquare(id, color) {
  const square = document.createElement('div');
  square.id = id;
  square.style.backgroundColor = color;
  square.addEventListener('drop', onDrop);
  square.addEventListener('dragover', allowDrop);

  return square;
}

function placePiece(square, src, colorName) {
  const piece = document.createElement('img');
  piece.id = 'piece' + ++pieceId;
  piece.src = src;
  piece.setAttribute('data-color', colorName);
  piece.draggable = true;
  piece.addEventListener('dragstart', onDragStart);

  square.appendChild(piece);
}

function onDragStart(e) {
  console.log('onDragStart', e.target);
  const piece = document.getElementById(e.target.id);
  e.dataTransfer.setData('pastSquareId', piece.parentElement.id);
  e.dataTransfer.setData('pieceSrc', piece.src);
  e.dataTransfer.setData('pieceColor', piece.getAttribute('data-color'));
}

function onDrop(e) {
  e.preventDefault();
  if (e.target instanceof HTMLDivElement) {
    const newSquare = document.getElementById(e.target.id);
    placePiece(
      newSquare,
      e.dataTransfer.getData('pieceSrc'),
      e.dataTransfer.getData('pieceColor')
    );
    document.getElementById('dropSound').play();

    const pastSquareId = e.dataTransfer.getData('pastSquareId');
    const pastSquare = document.getElementById(pastSquareId);
    pastSquare.removeChild(pastSquare.childNodes[0]);
  } else {
    const capturedPiece = document.getElementById(e.target.id);
    const pieceColor = e.dataTransfer.getData('pieceColor');
    if (capturedPiece.getAttribute('data-color') !== pieceColor) {
      const newSquare = capturedPiece.parentElement;
      newSquare.removeChild(newSquare.childNodes[0]);
      placePiece(
        newSquare,
        e.dataTransfer.getData('pieceSrc'),
        pieceColor
      );
      document.getElementById('dropSound').play();

      const pastSquareId = e.dataTransfer.getData('pastSquareId');
      const pastSquare = document.getElementById(pastSquareId);
      pastSquare.removeChild(pastSquare.childNodes[0]);
    } else {
      document.getElementById('forbiddenSound').play();
    }
  }
}

let pieceId = 0;
initialize();