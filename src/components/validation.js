const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
const namePattern = /^[A-Za-zА-Яа-яЁё\-\s]+$/;


function showInputError(form, input, errorMessage, config) {
  const errorElement = form.querySelector(`#${input.id}-error`);
  input.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
  input.setAttribute('data-error', errorMessage);
}

function hideInputError(form, input, config) {
  const errorElement = form.querySelector(`#${input.id}-error`);
  input.classList.remove(config.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(config.errorClass);
}

function checkInputValidity(form, input, config) {
  let errorMessage = '';
  const value = input.value.trim();

  if (input.name === 'name' || input.name === 'place-name') {
    if (!value) {
      errorMessage = 'Вы пропустили это поле.';
    } else if (value.length < 2) {
      errorMessage = `Минимальное количество символов: 2. Длина текста сейчас: ${value.length} символ.`;
    } else if (!nameRegex.test(value)) {
      errorMessage = 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.';
    }
  }

  if (input.name === 'description') {
    if (!value) {
      errorMessage = 'Вы пропустили это поле.';
    } else if (value.length < 2) {
      errorMessage = `Минимальное количество символов: 2. Длина текста сейчас: ${value.length} символ.`;
    } else if (value.length > 200) {
      errorMessage = 'Максимальное количество символов: 200.';
    } else if (!nameRegex.test(value)) {
      errorMessage = 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.';
    }
  }

  if (input.name === 'avatar-link') {
  if (!value) {
    errorMessage = 'Вы пропустили это поле.';
  } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(value)) {
    errorMessage = 'Введите корректный URL изображения.';
  }
}

  if (errorMessage) {
    input.setCustomValidity(errorMessage);
    showInputError(form, input, errorMessage, config);
  } else {
    input.setCustomValidity('');
    hideInputError(form, input, config);
  }
}



function hasInvalidInput(inputs) {
  return Array.from(inputs).some(input => !input.validity.valid);
}

function toggleButtonState(inputs, button, config) {
  if (hasInvalidInput(inputs)) {
    button.classList.add(config.inactiveButtonClass);
    button.disabled = true;
  } else {
    button.classList.remove(config.inactiveButtonClass);
    button.disabled = false;
  }
}

function setEventListeners(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      checkInputValidity(form, input, config);
      toggleButtonState(inputs, button, config);
    });
  });
}

export function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach(form => {
    setEventListeners(form, config);
    // Изначально кнопка неактивна если поля невалидны
    const inputs = Array.from(form.querySelectorAll(config.inputSelector));
    const button = form.querySelector(config.submitButtonSelector);
    toggleButtonState(inputs, button, config);
  });
}

// Очищает ошибки валидации и делает кнопку неактивной
export function clearValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);
  inputs.forEach(input => hideInputError(form, input, config));
  toggleButtonState(inputs, button, config);
}
