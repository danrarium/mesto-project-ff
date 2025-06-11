function showInputError(form, input, errorMessage, config) {
  const errorElement = form.querySelector(`#${input.id}-error`);
  input.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

function hideInputError(form, input, config) {
  const errorElement = form.querySelector(`#${input.id}-error`);
  input.classList.remove(config.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(config.errorClass);
}

function checkInputValidity(form, input, config) {
  if (input.validity.patternMismatch) {
    const errorMessage = input.dataset.errorPattern || input.validationMessage;
    showInputError(form, input, errorMessage, config);
  } else if (!input.validity.valid) {
    showInputError(form, input, input.validationMessage, config);
  } else {
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

function setEventListeners(inputs, button, form, config) {
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
    // Изначально кнопка неактивна если поля невалидны
    const inputs = Array.from(form.querySelectorAll(config.inputSelector));
    const button = form.querySelector(config.submitButtonSelector);
    setEventListeners(inputs, button, form, config);
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
