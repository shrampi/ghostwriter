const searchRouter = require('express').Router();
const { searchCatalog } = require('../utils/searchUtility');

const baseURL = '/api/search';

searchRouter.get(baseURL, (request, response) => {
  const query = request.query.query;
  if (!query) {
    return response.status(400).send({error: 'query must be specified'});
  }
  const results = searchCatalog(query);
  return response.json(results);
});

module.exports = searchRouter;