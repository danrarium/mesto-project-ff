const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-mag-4', // замени на свой cohort
  headers: {
    authorization: '807fbaac-f1a0-4f98-8f52-e8c1b5e9cdf2', // замени на свой токен
    'Content-Type': 'application/json'
  }
};

// Получить инфо о пользователе
export function getUserInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
  .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
}

// Получить карточки
export function getInitialCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
  .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
}

export function updateUserInfo({ name, about }) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  })
    .then(res => {
      if (res.ok) return res.json();
      return Promise.reject(`Ошибка: ${res.status}`);
    });
}

export function addCard({ name, link }) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link })
  })
    .then(res => {
      if (res.ok) return res.json();
      return res.json().then(err => {
        console.error('Ошибка создания карточки:', err);
        throw new Error(JSON.stringify(err));
      });
    });
}

export function addLike(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  }).then(res => res.json());
}

export function updateAvatar({ avatar }) {
  return fetch('https://nomoreparties.co/v1/cohort-mag-4/users/me/avatar', {
    method: 'PATCH',
    headers: {
      authorization: '807fbaac-f1a0-4f98-8f52-e8c1b5e9cdf2',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ avatar })
  }).then(res => res.ok ? res.json() : Promise.reject('Ошибка обновления аватара'));
}