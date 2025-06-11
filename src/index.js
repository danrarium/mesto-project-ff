import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './pages/index.css';
import './images/avatar.jpg';
import './blocks/validation/validation.css';
import { openModal, closeModal } from './components/modal.js';
import { createCard, handleLikeClick, handleDeleteClick } from './components/card.js';
import { enableValidation, clearValidation} from './components/validation.js';
import { getUserInfo, getInitialCards, updateUserInfo, addCard, updateAvatar } from './components/api.js';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

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

const saveButton = profileForm.querySelector('.popup__button');
const profileAvatar = document.querySelector('.profile__image');

document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated');
});


let userId; 

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  saveButton.textContent = 'Сохранение...';
  saveButton.disabled = true;

  const name = nameInput.value;
  const about = jobInput.value;

    updateUserInfo({ name, about })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(profilePopup);
    })
    .catch((err) => {
      alert(`Ошибка сохранения профиля: ${err}`);
    })
    .finally(() => {
      saveButton.textContent = 'Сохранить';
      saveButton.disabled = false;
    });
}

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
  const saveButton = evt.submitter;
  const cardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value
  };

  saveButton.textContent = 'Сохранение...';
  saveButton.disabled = true;

  addCard(cardData)
    .then(newCardData => {
      console.log('Новая карточка с сервера:', newCardData);
      const newCard = createCard(newCardData, userId, handleLikeClick, openConfirmDeletePopup, handleCardClick);
      cardsContainer.prepend(newCard);
      closeModal(addCardPopup);
      formAddCard.reset();
    })
    .catch(err => {
      alert(`Ошибка добавления карточки: ${err}`);
    })
    .finally(() => {
      saveButton.textContent = 'Сохранить';
      saveButton.disabled = false;
    });
}


function handleCardClick(data) {

  popupImage.src = data.link;
  popupImage.alt = data.name;
  popupCaption.textContent = data.name;

  openModal(popupImagePopup);
}

enableValidation(validationConfig);

// Например, при открытии профиля:
profileEditButton.addEventListener('click', () => {
  clearValidation(profileForm, validationConfig); // очистить ошибки и дизейблить кнопку
  nameInput.value = profileTitle.textContent;     // ПОДСТАВИТЬ АКТУАЛЬНОЕ value
  jobInput.value = profileDescription.textContent;
  openModal(profilePopup);
});

// Аналогично для формы добавления карточки при открытии
profileAddButton.addEventListener('click', () => {
  formAddCard.reset();
  clearValidation(formAddCard, validationConfig);
  openModal(addCardPopup);
});

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    // 1. Вставляем данные пользователя на страницу
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url('${userData.avatar}')`; // если аватар через background-image

    userId = userData._id;

    // 2. Рендерим карточки (массив cards)
    cards.forEach(cardData => {
      const cardElement = createCard(
      cardData,
      userId,
      handleLikeClick,    // обработчик лайка
      openConfirmDeletePopup,   // обработчик удаления
      handleCardClick     // обработчик просмотра картинки
  );
  cardsContainer.append(cardElement);
});
  })
  .catch(err => {
    console.error('Ошибка загрузки данных с сервера:', err);
  });

  nameInput.addEventListener('input', () => {
  console.log('[INPUT] value:', nameInput.value);
});

let cardToDelete = null;
let cardIdToDelete = null;

const confirmDeletePopup = document.querySelector('.popup_type_confirm-delete');
const confirmDeleteButton = document.querySelector('#confirm-delete-btn');

function openConfirmDeletePopup(cardId, cardElement) {
  cardToDelete = cardElement;
  cardIdToDelete = cardId;
  openModal(confirmDeletePopup);
}

// Подписываем кнопку "Да" внутри попапа
confirmDeleteButton.addEventListener('click', () => {
  handleDeleteClick(cardIdToDelete, cardToDelete);
  closeModal(confirmDeletePopup);
});

const avatarPopup = document.querySelector('.popup_type_update-avatar');
const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarForm.elements['avatar-link'];
const avatarEditButton = document.querySelector('.profile__image'); // div с аватаркой

avatarEditButton.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const saveButton = avatarForm.querySelector('.popup__button');
  saveButton.textContent = 'Сохранение...';
  saveButton.disabled = true;

  const avatarLink = avatarInput.value;
  updateAvatar({ avatar: avatarLink })
    .then(userData => {
      profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
      closeModal(avatarPopup);
    })
    .catch(err => alert('Ошибка обновления аватара: ' + err))
    .finally(() => {
      saveButton.textContent = 'Сохранить';
      saveButton.disabled = false;
    });
});