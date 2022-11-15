import axios from 'axios';

export const getBook = () => {
  axios.get('https://www.gutenberg.org/cache/epub/100/')
    .then((response) => console.log(response));
}
