import * as mb from './messageboard.js';

// message board app
// stage 8: Data belongs in a database
import express from 'express';

const app = express();

app.use(express.static('client', { extensions: ['html'] }));

async function getMessages(req, res) {
  res.json(await mb.listMessages());
}

async function getMessage(req, res) {
  const result = await mb.findMessage(req.params.id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send('No match for that ID.');
  }
}

async function postMessage(req, res) {
  const messages = await mb.addMessage(req.body.msg);
  res.json(messages);
}

async function putMessage(req, res) {
  const message = await mb.editMessage(req.params.id, req.body);
  res.json(message);
}

app.get('/messages', getMessages);
app.get('/messages/:id', getMessage);
app.put('/messages/:id', express.json(), putMessage);
app.post('/messages', express.json(), postMessage);

app.listen(8080);
