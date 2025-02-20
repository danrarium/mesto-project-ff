// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCards(cardData, cardDeleate) {
    // клонируем шаблон
    const cardElement = cardTemplate.cloneNode(true);

    // устанавливаем содержимое
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleateButton = cardElement.querySelector('.card__delete-button');

    cardImage.src = cardData.link;
    cardTitle.textContent = cardData.name;

    //вешаем клик
    deleateButton.addEventListener('click', () => {
        cardDeleate(cardElement);
    });

    return cardElement;
}

// @todo: Функция удаления карточки
function deleateCard(cardElement) {
    cardElement.remove();
}
// @todo: Вывести карточки на страницу
initialCards.forEach((cardData) => {
    const card = createCard(cardData, deleateCard);
    placesList.append(card);
})