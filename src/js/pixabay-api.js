import axios from 'axios';

const API_KEY = '51148638-4215382d54794cb096cce3e5a';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page) {
  const searchParams = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page, // Передаємо поточну сторінку
    perPage: 15, // ТЗ: у кожній відповіді повинно приходити 15 об'єктів
  };

  // Використовуємо await для асинхронного запиту
  const response = await axios.get(BASE_URL, { params: searchParams });

  // Повертаємо властивість data з отриманої відповіді
  return response.data;
}
