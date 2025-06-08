// Обработчик лайка
export function handleLikeClick(cardData, userId, likeButton, likeCount) {
  const isLiked = cardData.likes.some(like => like._id === userId);

  // Пример fetch-запроса:
  fetch(`https://nomoreparties.co/v1/cohort-mag-4/cards/likes/${cardData._id}`, {
    method: isLiked ? 'DELETE' : 'PUT',
    headers: {
      authorization: '807fbaac-f1a0-4f98-8f52-e8c1b5e9cdf2',
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then((updatedCard) => {
    // Обновляем отображение количества лайков и активность кнопки
    likeCount.textContent = updatedCard.likes.length;
    likeButton.classList.toggle('card__like-button_is-active', updatedCard.likes.some(like => like._id === userId));
    // Не забудь обновить cardData.likes на актуальные!
    cardData.likes = updatedCard.likes;
  })
  .catch(err => console.log(err));
}

export function handleDeleteClick(cardId, cardElement) {
  fetch(`https://nomoreparties.co/v1/cohort-mag-4/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: '807fbaac-f1a0-4f98-8f52-e8c1b5e9cdf2',
      'Content-Type': 'application/json'
    }
  })
  .then(res => {
    if (!res.ok) throw new Error('Не удалось удалить карточку');
    // Удаляем DOM-элемент только после успешного ответа от сервера
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
    deleteButton.style.display = 'none'; // скрыть если чужая
  } else {
    deleteButton.addEventListener('click', () => openConfirmDeletePopup(data._id, cardElement));
  }

  return cardElement;
}

export function deleteCardFromServer(cardId) {
  return fetch(`https://nomoreparties.co/v1/cohort-mag-4/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: '807fbaac-f1a0-4f98-8f52-e8c1b5e9cdf2',
      'Content-Type': 'application/json'
    }
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Не удалось удалить карточку');
    }
    return res.json();
  });
}