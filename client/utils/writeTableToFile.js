const suctable = require('./successorTable');
const fs = require('fs');

const text = require('../resources/text');
const table = suctable.generateSuccessorTable(text);

fs.writeFileSync('paradise-lost-table.json', JSON.stringify(table), 'utf-8');