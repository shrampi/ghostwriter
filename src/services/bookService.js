import axios from 'axios';

export const getBook = () => {
  axios.get('/api')
    .then((response) => console.log(response));
}
