const gameContainer = document.getElementById('game-container');
let flippedCards = [];
let matchedPairs = 0;

fetch('/api/images')
  .then(response => response.json())
  .then(images => createGameBoard(images));

function createGameBoard(images) {
  const cards = [...images, ...images];
  shuffle(cards);

  cards.forEach(image => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.image = image;
    cardElement.addEventListener('click', flipCard);
    gameContainer.appendChild(cardElement);
  });
}

function flipCard(event) {
  const card = event.target;
  if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
    card.style.backgroundImage = `url(/images/${card.dataset.image})`;
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      checkForMatch();
    }
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.image === card2.dataset.image) {
    matchedPairs++;
    flippedCards = [];
    if (matchedPairs === 8) {
      alert('Поздравляем! Вы выиграли!');
    }
  } else {
    setTimeout(() => {
      card1.style.backgroundImage = '';
      card2.style.backgroundImage = '';
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}