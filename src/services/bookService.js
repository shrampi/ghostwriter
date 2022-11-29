import axios from 'axios';

const baseURL = 'https://www.gutenberg.org';

const getBook = (id) => {
  console.log('getting book...');
  const bookURL = `${baseURL}/cache/epub/${id}/pg${id}.txt`
  axios.get(bookURL)
    .then((response) => console.log(response.data.length))
    .catch((response) => console.log('error getting book'));
}

export default { getBook };