import { likeCard, unlikeCard, deleteCard  } from './api.js';

// Обработчик лайка
export function handleLikeClick(cardData, userId, likeButton, likeCount) {
  const isLiked = cardData.likes.some(like => like._id === userId);

  const apiMethod = isLiked ? unlikeCard : likeCard;
  apiMethod(cardData._id)
    .then((updatedCard) => {
      likeCount.textContent = updatedCard.likes.length;
      likeButton.classList.toggle(
        'card__like-button_is-active',
        updatedCard.likes.some(like => like._id === userId)
      );
      cardData.likes = updatedCard.likes;
    })
    .catch(err => {
      // обработка ошибок (можно alert или console.log)
      console.error('Ошибка лайка:', err);
    });
}

export function handleDeleteClick(cardId, cardElement) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      alert('Ошибка удаления карточки: ' + err);
    });
}

// Создание карточки
export function createCard(data, userId, handleLikeClick, openConfirmDeletePopup, handleCardClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  const likeCount = cardElement.querySelector('.card__like-count');
  const isLiked = data.likes.some(like => like._id === userId);

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeCount.textContent = data.likes.length;

  if (data.likes.some(user => user._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => handleLikeClick(data, userId, likeButton, likeCount));
  cardImage.addEventListener('click', () => handleCardClick(data));

   if (data.owner._id !== userId) {
  deleteButton.remove(); // удаляем из DOM
} else {
  deleteButton.addEventListener('click', () => openConfirmDeletePopup(data._id, cardElement));
}

  return cardElement;
}
