import axios from 'axios';

const API_KEY = '51148638-4215382d54794cb096cce3e5a';
const BASE_URL = 'https://pixabay.com/api/';

export function getImagesByQuery(query) {
  const searchParams = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  return axios.get(BASE_URL, { params: searchParams }).then(response => {
    // Повертаємо саме властивість data, як вимагає ТЗ
    return response.data;
  });
}
