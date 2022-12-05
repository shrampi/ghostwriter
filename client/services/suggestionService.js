import axios from 'axios';
const baseURL = '/api/sources';

const formatWordsIntoQuery = (words) => {
  let query = '';
  if (words.length) {
    query += '?words=';
    for (let word of words) {
      query += `${word}+`;
    }
    query = query.slice(0, query.length - 1);
  }
  return query;
}

const getSuggestionFromSource = (source, words) => {
  let url = `${baseURL}/${source.id}/${formatWordsIntoQuery(words)}`;
  const request = axios.get(url);
  return request.then(response => response.data);
}

export default { getSuggestionFromSource };