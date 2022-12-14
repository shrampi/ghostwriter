const http = require('http');
const app = require('./app');
const config = require('./config');

const server = http.createServer(app);

const PORT = config.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})