const sourcesRouter = require('express').Router();
const sources = require('../resources/sources.json');
const findNextWord = require('../utils/findNextWord');

const baseURL = '/api/sources';

sourcesRouter.get(baseURL, (request, response) => {
  console.log('Source information requested...');
  const sourcesInfo = sources.map((source) => ({
    id: source.id,
    title: source.title,
    author: source.author,
  }));
  return response.json(sourcesInfo);
});

sourcesRouter.get(baseURL + '/:id', (request, response) => {
  const id = request.params.id;
  const wordsQuery = request.query.words;
  const words = wordsQuery ? wordsQuery.split(' ') : [];

  if (words.length > 3) {
    return response
      .status(400)
      .send({ error: 'words query must have less than four words' });
  }

  const source = sources.find((source) => source.id === id);

  if (!source) {
    return response.status(400).send({error: 'source with specified id does not exist'});
  }

  console.log('Next word requested from source: ', source.title, source.author);
  console.log('Predecessors query: ', words);

  const nextWord = findNextWord(source.data, words);
  console.log('Next word found: ', nextWord);
  return response.json(nextWord);
});

module.exports = sourcesRouter;
