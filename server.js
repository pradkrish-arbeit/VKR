const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use('/api', router); // API routes
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
