const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.send(err.message);
});

app.listen(8080, () => {
  console.log(`Example app listening on port 8080!`);
});
