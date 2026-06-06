// Тут ми імпортуємо бібліотеку SimpleLightbox, створюємо її екземпляр
// та пишемо 4 обов'язкові функції для маніпуляцій з DOM.

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Знаходимо елементи в DOM
const galleryContainer = document.querySelector('.gallery');
const loaderElement = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more-btn'); // Знаходимо кнопку

// Ініціалізуємо SimpleLightbox один раз поза функціями
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// 1. Функція створення галереї
export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    </li>
  `
    )
    .join('');

  // Додаємо в DOM за одну операцію
  galleryContainer.insertAdjacentHTML('beforeend', markup);

  // Обов'язково оновлюємо лайтбокс
  lightbox.refresh();
}

// 2. Функція очищення галереї
export function clearGallery() {
  galleryContainer.innerHTML = '';
}

// 3. Функція показу лоадера
export function showLoader() {
  loaderElement.classList.remove('hidden');
}

// 4. Функція приховування лоадера
export function hideLoader() {
  loaderElement.classList.add('hidden');
}

// Нова функція: показує кнопку Load more
export function showLoadMoreButton() {
  loadMoreButton.classList.remove('hidden');
}

// Нова функція: ховає кнопку Load more
export function hideLoadMoreButton() {
  loadMoreButton.classList.add('hidden');
}
