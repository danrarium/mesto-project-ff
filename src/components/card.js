// Обработчик лайка
export function handleLikeClick(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

// Обработчик удаления
export function handleDeleteCard(cardElement) {
  cardElement.remove();
}

// Создание карточки
export function createCard(data, handleLikeClick, handleDeleteCard, handleCardClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeButton.addEventListener('click', handleLikeClick);
deleteButton.addEventListener('click', () => handleDeleteCard(cardElement));
  cardImage.addEventListener('click', () => handleCardClick(data));

  return cardElement;
}