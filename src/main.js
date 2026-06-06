// npm install axios izitoast simplelightbox
// Головний файл логіки (src/main.js) з пагінацією та скролом
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
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const searchForm = document.querySelector('.form');
const loadMoreButton = document.querySelector('.load-more-btn');

// Глобальні змінні для збереження стану пагінації
let userQuery = '';
let currentPage = 1;
const perPage = 15;

searchForm.addEventListener('submit', handleSearch);
loadMoreButton.addEventListener('click', handleLoadMore);

// 1. Обробка першого сабміту форми
async function handleSearch(event) {
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

  // Зберігаємо запит у глобальну змінну та скидаємо сторінку на 1
  userQuery = query;
  currentPage = 1;

  // Очищаємо попередні результати
  clearGallery();
  // При повторному сабміті ховаємо кнопку
  hideLoadMoreButton();
  // Показуємо індикатор завантаження
  showLoader();

  // 3. Виконуємо HTTP-запит
  try {
    const data = await getImagesByQuery(userQuery, currentPage);

    // Перевіряємо, чи масив hits не порожній
    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      // Тут форму НЕ очищаємо, щоб користувач міг виправити помилку в слові
      return;
    }

    // Якщо зображення знайдені, відмальовуємо їх
    createGallery(data.hits);

    // Очищаємо форму ТІЛЬКИ у разі успішного пошуку
    form.reset();

    // Перевіряємо, чи є ще сторінки для завантаження
    if (data.totalHits > perPage * currentPage) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    // Обробка помилок запиту (наприклад, пропав інтернет чи ліміт API)
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    // Тут форму теж НЕ очищаємо, бо якщо впав інтернет,
    // користувач захоче просто натиснути "Search" ще раз, коли зв'язок з'явиться
  } finally {
    // Тут залишаємо ТІЛЬКИ приховування лоадера
    // У будь-якому випадку (успіх чи помилка) приховуємо лоадер
    hideLoader();
  }
}

// 2. Обробка кліку на кнопку "Load more"
async function handleLoadMore() {
  currentPage += 1; // Збільшуємо номер сторінки на 1

  hideLoadMoreButton(); // Тимчасово ховаємо кнопку під час завантаження
  showLoader();

  try {
    const data = await getImagesByQuery(userQuery, currentPage);

    createGallery(data.hits);

    // Функція плавного прокручування сторінки
    smoothScroll();

    // Перевірка, чи не дійшли ми до кінця колекції
    if (data.totalHits > perPage * currentPage) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton(); // Остаточно ховаємо кнопку
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

// 3. Функція для плавного скролу згідно з ТЗ
function smoothScroll() {
  const galleryItem = document.querySelector('.gallery-item');

  if (galleryItem) {
    // Отримуємо висоту однієї картки разом із відступами
    const cardHeight = galleryItem.getBoundingClientRect().height;

    // Прокручуємо сторінку на дві висоти картки
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
