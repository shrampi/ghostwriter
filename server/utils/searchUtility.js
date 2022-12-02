const catalog = require('../resources/gutenbergCatalog.json');

const checkIsNum = (input) => {
  return /^\d+$/.test(input);
}

const filterCatalog = (filter) => {
  filter = filter.toLowerCase();
  return catalog.filter(item => {
    for (let key in item) {
      if (item[key].toLowerCase().includes(filter)) {
        return true;
      }
    }
    return false;
  });
}

const searchCatalog = (query, maxResults=20) => {
  console.log('searching catalog for ', query);

  // Return book with matching id for a number query
  if (checkIsNum(query)) {
    return catalog.filter(item => item['Text#'] === query);
  }

  const results = filterCatalog(query).slice(0, maxResults);
  console.log('results found: ', results);
  return results;
}

module.exports = { searchCatalog };