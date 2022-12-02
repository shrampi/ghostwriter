const sourceRouter = require('express').Router();
const sources = require('../resources/initialSources.json');

const baseURL = '/api/sources';

sourceRouter.get(baseURL, (request, response) => {
  const abbreviatedSources = sources.map(source => ({id: source.id, name: source.name}));
  return response.json(abbreviatedSources);
})

sourceRouter.get(baseURL + '/:id', (request, response) => {
  const source = sources.filter((source) => source.id === request.params.id)[0];
  if (!source) {
    return response.status(400).send({ error: `blog with id ${request.params.id} does not exist`});
  }
  return response.send(source)
})

module.exports = sourceRouter;