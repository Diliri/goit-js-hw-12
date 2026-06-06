// npm install axios izitoast simplelightbox
// Головний файл логіки (src/main.js)
// Тут ми збираємо все докупи: імпортуємо наші функції,
// вішаємо слухач на форму та використовуємо обробники.then() і.catch().
// Також тут підключаємо iziToast.

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';

const searchForm = document.querySelector('.form');

searchForm.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();

  // Отримуємо значення з інпуту та обрізаємо пробіли
  const form = event.currentTarget;
  const query = form.elements['search-text'].value.trim();

  // Перевірка на порожній рядок
  if (query === '') {
    iziToast.warning({
      title: 'Caution',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  // 1. Очищаємо попередні результати
  clearGallery();

  // 2. Показуємо індикатор завантаження
  showLoader();

  // 3. Виконуємо HTTP-запит
  getImagesByQuery(query)
    .then(data => {
      // Перевіряємо, чи масив hits не порожній
      if (data.hits.length === 0) {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
        return;
      }

      // Якщо зображення знайдені, відмальовуємо їх
      createGallery(data.hits);
    })
    .catch(error => {
      // Обробка помилок запиту (наприклад, пропав інтернет чи ліміт API)
      console.error(error);
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong. Please try again later.',
        position: 'topRight',
      });
    })
    .finally(() => {
      // У будь-якому випадку (успіх чи помилка) приховуємо лоадер
      hideLoader();
      // Очищаємо форму після пошуку
      searchForm.reset();
    });
}
