// message board app
// stage 5: refactor to separate http/web code from core logic
import express from 'express';
import * as mb from './messageboard.js';

const app = express();
app.use(express.static('client'));

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

app.get('/messages', getMessages);
app.get('/messages/:id', getMessage);
app.post('/messages', express.json(), postMessage);

app.listen(8080);
