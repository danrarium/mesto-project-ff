import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './pages/index.css';
import './images/avatar.jpg';
import { initialCards } from './scripts/cards.js';
import { openModal, closeModal } from './components/modal.js';
import { createCard, handleLikeClick, handleDeleteCard } from './components/card.js';




// @todo: Темплейт карточки


const profileEditButton = document.querySelector('.profile__edit-button');
const profilePopup = document.querySelector('.popup_type_edit');
const popupCloseButtons = document.querySelectorAll('.popup__close');

const profileAddButton = document.querySelector('.profile__add-button');

const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const profileForm = document.querySelector('.popup__form_type_edit');
const formAddCard = document.querySelector('.popup_type_new-card .popup__form');


const placeNameInput = formAddCard.elements['place-name'];
const placeLinkInput = formAddCard.elements['link'];

const cardsContainer = document.querySelector('.places__list');

const addCardPopup = document.querySelector('.popup_type_new-card');

const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');
const popupImagePopup = document.querySelector('.popup_type_image');



initialCards.forEach((cardData) => {
  const card = createCard(cardData, handleLikeClick, handleDeleteCard, handleCardClick);
  cardsContainer.append(card);
});


function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(profilePopup);
}

// Открытие попапа профиля и заполнение полей актуальными данными
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(profilePopup);
});

// Закрытие всех попапов по кнопке закрытия
popupCloseButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const popup = btn.closest('.popup');
    closeModal(popup);
  });
});

document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup')) {
      closeModal(popup);
    }
  });
});

// Отправка формы
profileForm.addEventListener('submit', handleProfileFormSubmit);


// Кнопка открытия попапа добавления карточки
profileAddButton.addEventListener('click', () => {
  formAddCard.reset(); // очищаем поля при открытии
  openModal(addCardPopup);
});


formAddCard.addEventListener('submit', handleAddCardFormSubmit);

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
    const cardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value
  };
  const newCard = createCard(cardData, handleLikeClick, handleDeleteCard, handleCardClick);
  cardsContainer.prepend(newCard);
  closeModal(addCardPopup);
  formAddCard.reset();
}


function handleCardClick(data) {

  popupImage.src = data.link;
  popupImage.alt = data.name;
  popupCaption.textContent = data.name;

  openModal(popupImagePopup);
}