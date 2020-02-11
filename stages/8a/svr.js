'use strict';

// message board app
// stage 6: add an API route and client page for update messages
const express = require('express');
const app = express();
const mb = require('./messageboard.pg');

app.use(express.static('client', { extensions: ['html'] }));

async function getMessages(req, res) {
  res.json(await mb.getMessages());
}

async function getMessage(req, res) {
  const result = await mb.getMessage(req.params.id);
  if (!result) {
    res.status(404).send('No match for that ID.');
    return;
  }
  res.json(result);
}

async function postMessage(req, res) {
  const messages = await mb.addMessage(req.body.msg);
  res.json(messages);
}

async function putMessage(req, res) {
  const message = await mb.editMessage(req.body);
  res.json(message);
}

app.get('/messages', getMessages);
app.get('/messages/:id', getMessage);
app.put('/messages/:id', express.json(), putMessage);
app.post('/messages', express.json(), postMessage);

app.listen(8080);
