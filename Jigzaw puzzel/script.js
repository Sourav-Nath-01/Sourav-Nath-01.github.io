const uploadInput = document.getElementById("imageUpload");
const uploadLabel = document.getElementById("uploadLabel");
const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const puzzleContainer = document.getElementById("puzzle-container");
const difficultyLabel = document.getElementById("difficulty-label");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");

let uploadedImage = null;
let moves = 0;
let timer = 0;
let timerInterval = null;
let currentDifficulty = 5;
let currentGridCols = 0;
let currentGridRows = 0;

// Update difficulty label
difficultySelect.addEventListener("change", () => {
  const pieces = difficultySelect.value;
  difficultyLabel.textContent = `Difficulty: ${pieces} pieces`;
});

// Upload image (modified)
uploadInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage = e.target.result;
      // Change label text and color after upload
      uploadLabel.textContent = "Image Uploaded ✅";
      uploadLabel.style.background = "#4caf50";
      uploadLabel.style.color = "#fff";
    };
    reader.readAsDataURL(file);
  } else {
    uploadLabel.textContent = "Upload Image";
    uploadLabel.style.background = "#fff";
    uploadLabel.style.color = "#333";
  }
});

// Start Puzzle
startBtn.addEventListener("click", () => {
  if (!uploadedImage) {
    alert("Please upload an image first!");
    return;
  }
  currentDifficulty = parseInt(difficultySelect.value);
  startPuzzle();
  restartBtn.disabled = false;
});

// Restart Puzzle
restartBtn.addEventListener("click", () => {
  if (uploadedImage) {
    startPuzzle();
  }
});

function startPuzzle() {
  puzzleContainer.innerHTML = "";
  moves = 0;
  timer = 0;
  movesDisplay.textContent = "Moves: 0";
  timerDisplay.textContent = "Time: 0s";
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
  }, 1000);

  switch (currentDifficulty) {
    case 5:
      currentGridCols = 5;
      currentGridRows = 1;
      break;
    case 20:
      currentGridCols = 5;
      currentGridRows = 4;
      break;
    case 40:
      currentGridCols = 8;
      currentGridRows = 5;
      break;
    case 80:
      currentGridCols = 10;
      currentGridRows = 8;
      break;
    case 100:
      currentGridCols = 10;
      currentGridRows = 10;
      break;
    default:
      currentGridCols = 5;
      currentGridRows = 1;
  }

  const pieceWidth = puzzleContainer.clientWidth / currentGridCols;
  const pieceHeight = puzzleContainer.clientHeight / currentGridRows;

  let pieces = [];

  for (let row = 0; row < currentGridRows; row++) {
    for (let col = 0; col < currentGridCols; col++) {
      const piece = document.createElement("div");
      piece.classList.add("puzzle-piece");
      piece.style.width = `${pieceWidth}px`;
      piece.style.height = `${pieceHeight}px`;
      piece.style.backgroundImage = `url(${uploadedImage})`;
      piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
      piece.dataset.correctPos = `${row}-${col}`;
      pieces.push(piece);
    }
  }

  shuffleArray(pieces);

  pieces.forEach((piece) => {
    piece.draggable = true;
    puzzleContainer.appendChild(piece);
  });

  addDragAndDrop();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function addDragAndDrop() {
  let dragged = null;

  document.querySelectorAll(".puzzle-piece").forEach((piece) => {
    piece.addEventListener("dragstart", () => {
      dragged = piece;
      piece.style.opacity = 0.5;
    });

    piece.addEventListener("dragend", () => {
      dragged.style.opacity = "";
      dragged = null;
    });

    piece.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    piece.addEventListener("drop", (e) => {
      e.preventDefault();
      if (dragged !== piece) {
        const container = piece.parentNode;
        const draggedNext = dragged.nextSibling;
        const pieceNext = piece.nextSibling;

        container.insertBefore(dragged, pieceNext);
        container.insertBefore(piece, draggedNext);

        moves++;
        movesDisplay.textContent = `Moves: ${moves}`;
        checkWin();
      }
    });
  });
}

function checkWin() {
  const pieces = [...document.querySelectorAll(".puzzle-piece")];
  const isSolved = pieces.every((piece, index) => {
    const row = Math.floor(index / currentGridCols);
    const col = index % currentGridCols;
    return piece.dataset.correctPos === `${row}-${col}`;
  });

  if (isSolved) {
    clearInterval(timerInterval);
    document.getElementById("final-stats").textContent = 
      `You solved it in ${moves} moves and ${timer} seconds!`;
    document.getElementById("win-overlay").style.display = "flex";
  }
}

function closeWin() {
  document.getElementById("win-overlay").style.display = "none";
}
