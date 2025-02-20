// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCards(cardData, cardDelete) {
    // клонируем шаблон
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    // устанавливаем содержимое
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardImage.src = cardData.link;
    cardTitle.textContent = cardData.name;

    //вешаем клик
    deleteButton.addEventListener('click', () => {
        cardDelete(cardElement);
    });

    return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(cardElement) {
    cardElement.remove();
}
// @todo: Вывести карточки на страницу
initialCards.forEach((cardData) => {
    const card = createCards(cardData, deleteCard);
    placesList.append(card);
})