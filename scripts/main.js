function initialize() {
  const content = document.querySelector('.content');

  const colors = ['white', 'black'];

  const whitePieces = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
  const blackPieces = ['♖', '♞', '♝', '♛', '♛', '♝', '♞', '♜'];

  let line = 1;
  let column = 0;
  let colorIndex = 0;

  for (let i = 1; i <= 64; i++) {
    const div = document.createElement('div');
    div.id = 'square' + i;
    div.addEventListener('drop', onDrop);
    div.addEventListener('dragover', allowDrop);
    div.style.backgroundColor = colors[colorIndex];
    colorIndex = colorIndex > 0 ? colorIndex - 1 : colorIndex + 1;
    div.style.color = colors[colorIndex];

    if (line === 1) {
      div.appendChild(createPiece(whitePieces[column]));
      column++;
    }

    if (line === 2) {
      div.appendChild(createPiece('♙'));
    }

    if (line === 7) {
      div.appendChild(createPiece('♟'));
    }

    if (line === 8) {
      div.appendChild(createPiece(blackPieces[column]));
      column++;
    }

    // when line changed
    if (i % 8 === 0) {
      line++;
      column = 0;
      colorIndex = colorIndex > 0 ? colorIndex - 1 : colorIndex + 1;
    }

    content.appendChild(div);
  }
}

function createPiece(text) {
  const span = document.createElement('span');
  span.id = 'piece' + ++pieceId;
  span.innerText = text;
  span.tabIndex = 0;
  span.draggable = true;
  span.addEventListener('dragstart', onDragStart);

  return span;
}

function allowDrop(e) {
  e.preventDefault();
}

function onDragStart(e) {
  console.log('onDragStart', e);
  const piece = document.getElementById(e.target.id);
  e.dataTransfer.setData('square', piece.parentElement.id);
  e.dataTransfer.setData('piece', piece.id);
}

function onDrop(e) {
  e.preventDefault();
  console.log('onDrop', e);
  const newSquare = document.getElementById(e.target.id);
  if (newSquare.childNodes.length > 0) {
    return;
  }
  document.getElementById('dropSound').play();
  const squareId = e.dataTransfer.getData('square');
  const pieceId = e.dataTransfer.getData('piece');
  
  const currSquare = document.getElementById(squareId);
  const piece = document.getElementById(pieceId);

  currSquare.removeChild(piece);
  newSquare.appendChild(createPiece(piece.innerText));
}

let pieceId = 0;
initialize();