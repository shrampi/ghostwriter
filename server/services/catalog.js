const axios = require('axios');

const catalogAPI = 'https://gutendex.com/books';

const searchCatalog = (name) => {
  const queryURL = `${catalogAPI}?search=${name}`;
  const request = axios.get(queryURL);
  return request.then(response => response.data);
}

module.exports = { searchCatalog };