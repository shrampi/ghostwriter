import axios from 'axios';
const baseURL = '/api/sources';

const getAllSources = () => {
  const request = axios.get(baseURL);
  return request.then(response => response.data);
}

const getSource = (sourceID) => {
  const request = axios.get(`${baseURL}/${sourceID}`);
  return request.then(response => response.data);
}

export default { getAllSources, getSource };