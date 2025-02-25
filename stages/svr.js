import * as mb from './messageboard.js';

// message board app
// stage 6: add an API route and client page for update messages
import express from 'express';

const app = express();

app.use(express.static('client', { extensions: ['html'] }));

function getMessages(req, res) {
  res.json(mb.listMessages());
}

function getMessage(req, res) {
  const result = mb.findMessage(req.params.id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send('No match for that ID.');
  }
}

function postMessage(req, res) {
  const messages = mb.addMessage(req.body.msg);
  res.json(messages);
}

function putMessage(req, res) {
  const message = mb.editMessage(req.body);
  res.json(message);
}

app.get('/messages', getMessages);
app.get('/messages/:id', getMessage);
app.put('/messages/:id', express.json(), putMessage);
app.post('/messages', express.json(), postMessage);

app.listen(8080);
