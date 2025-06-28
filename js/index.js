import { hideModal, showModal } from "./modal.js";
import { showNotification } from "./notification.js";

// Game state
let gameState = {
  secretWord: "",
  description: "",
  guessedLetters: [],
  wrongGuesses: 0,
  maxWrongGuesses: 7,
  gameOver: false,
};

const setupSection = document.querySelector(".setup-section");
const gameSection = document.querySelector(".game-section");
const wordDisplay = document.querySelector(".word-display");
const keyboard = document.querySelector(".keyboard");
const wrongGuessesDisplay = document.querySelector("#wrong-guesses");
const lettersLeftDisplay = document.querySelector("#letters-left");
const wordDescription = document.querySelector(".word-description");
const hangmanParts = document.querySelectorAll(".hangman-part");
const secretWordInputElem = document.querySelector("#secret-word");
const wordDescriptionInputElem = document.querySelector("#word-description");

// Initialize the game
document.addEventListener("DOMContentLoaded", () => {
  // Create keyboard
  createKeyboard();

  document.querySelector("#start-game").addEventListener("click", startGame);
  document.querySelector("#show-hint").addEventListener("click", showHint);
  document.querySelector("#new-game").addEventListener("click", restartGame);

  // Allow pressing Enter to start the game
  secretWordInputElem.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      startGame();
    }
  });
});

function createKeyboard() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let letter of letters) {
    const key = document.createElement("div");
    key.classList.add("key");
    key.textContent = letter;
    key.dataset.letter = letter;

    key.addEventListener("click", () => {
      if (!gameState.gameOver && !key.classList.contains("used")) {
        guessLetter(letter);
      }
    });

    keyboard.appendChild(key);
  }
}

function startGame() {
  const secretWord = secretWordInputElem.value.trim().toUpperCase();
  const descriptionInput = document
    .querySelector("#word-description")
    .value.trim();

  if (!secretWord) {
    const message = "Please enter a secret word!";
    showNotification(message, "error");
    return;
  }

  // Validate the word contains only letters
  if (!/^[A-Za-z]+$/.test(secretWord)) {
    showNotification(
      "Please enter a word containing only letters (no spaces or special characters)"
    );
    return;
  }

  gameState.secretWord = secretWord.toUpperCase();
  gameState.description = descriptionInput;
  gameState.guessedLetters = [];
  gameState.wrongGuesses = 0;
  gameState.gameOver = false;

  setupSection.style.display = "none";
  gameSection.style.display = "block";

  hangmanParts.forEach((part) => {
    part.style.display = "none";
  });

  wordDescription.style.display = "none";

  updateWordDisplay();
  updateLettersLeft();
  wrongGuessesDisplay.textContent = `0/${gameState.maxWrongGuesses}`;

  document.querySelectorAll(".key").forEach((key) => {
    key.className = "key";
  });

  gameSection.style.animation = "fadeIn 0.5s ease-out";
}

function guessLetter(letter) {
  if (gameState.guessedLetters.includes(letter) || gameState.gameOver) return;

  const key = document.querySelector(`.key[data-letter="${letter}"]`);
  key.classList.add("used");

  gameState.guessedLetters.push(letter);

  if (gameState.secretWord.includes(letter)) {
    key.classList.add("correct");
    updateWordDisplay();
    checkWin();
  } else {
    key.classList.add("wrong");
    gameState.wrongGuesses++;
    wrongGuessesDisplay.textContent = `${gameState.wrongGuesses}/${gameState.maxWrongGuesses}`;
    hangmanParts[gameState.wrongGuesses - 1].style.display = "block";
    checkLoss();
  }

  updateLettersLeft();
}

function updateWordDisplay() {
  const displayWord = gameState.secretWord
    .split("")
    .map((letter) => {
      return gameState.guessedLetters.includes(letter) ? letter : "_";
    })
    .join(" ");
  wordDisplay.textContent = displayWord;
}

function updateLettersLeft() {
  const uniqueLetters = new Set(gameState.secretWord.split(""));
  const lettersLeft = [...uniqueLetters].filter(
    (letter) => !gameState.guessedLetters.includes(letter)
  ).length;
  lettersLeftDisplay.textContent = lettersLeft;
}

function checkWin() {
  if (
    gameState.secretWord
      .split("")
      .every((letter) => gameState.guessedLetters.includes(letter))
  ) {
    endGame(true);
  }
}

function checkLoss() {
  if (gameState.wrongGuesses >= gameState.maxWrongGuesses) {
    endGame(false);
  }
}

function endGame(won) {
  gameState.gameOver = true;

  const title = won ? "Congratulations!" : "Game Over";
  const message = won
    ? `You guessed the word: ${gameState.secretWord}`
    : `The word was: ${gameState.secretWord}`;
  const button = [
    {
      text: "Play again!",
      className: "",
      handler: resetGame,
    },
  ];
  showModal(title, message, button);
}

function showHint() {
  if (gameState.description) {
    wordDescription.textContent = gameState.description;
    wordDescription.style.display = "block";
  } else {
    const message = "No hint available for this word.";
    showNotification(message);
  }
}

function resetGame() {
  gameState = {
    secretWord: "",
    description: "",
    guessedLetters: [],
    wrongGuesses: 0,
    maxWrongGuesses: 8,
    gameOver: false,
  };
  setupSection.style.display = "block";
  gameSection.style.display = "none";
  wordDisplay.textContent = "";
  secretWordInputElem.value = "";
  wordDescriptionInputElem.value = "";
  wrongGuessesDisplay.textContent = "0/6";
  lettersLeftDisplay.textContent = "0";
  wordDescription.style.display = "none";
  keyboard.innerHTML = "";
  hideModal();
  createKeyboard();
}

function restartGame() {
  const title = "Start a new game?";
  const message = "Your current score will not be saved.";

  const buttons = [
    {
      text: "Confirm",
      className: "btn-success",
      handler: resetGame,
    },
    {
      text: "Cancel",
      className: "btn-secondary",
      handler: hideModal,
    },
  ];

  showModal(title, message, buttons);
}
