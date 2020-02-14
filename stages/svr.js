const express = require('express');
const app = express();
app.use('/', express.static('my_lovely_special_root_folder'));

const messages = ['hello mum'];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.listen(65535);
