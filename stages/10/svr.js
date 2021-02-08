// message board app
// stage 8: Data belongs in a database
import express from 'express';
import multer from 'multer';
import * as mb from './messageboard.js';

const app = express();

const uploader = multer({
  dest: 'upload',
  limits: { // for security
    fields: 10,
    fileSize: 1024 * 1024 * 20, // 20MB
    files: 1,
  },
});

app.use(express.static('client', { extensions: ['html'] }));

async function getMessages(req, res) {
  res.json(await mb.listMessages());
}

async function getMessage(req, res) {
  const result = await mb.findMessage(req.params.id);
  if (!result) {
    res.status(404).send('No match for that ID.');
    return;
  }
  res.json(result);
}

async function postMessage(req, res) {
  const messages = await mb.addMessage(req.body.msg, req.file);
  res.json(messages);
}

async function putMessage(req, res) {
  const message = await mb.editMessage(req.body);
  res.json(message);
}

// wrap async function for express.js error handling
function asyncWrap(f) {
  return (req, res, next) => {
    Promise.resolve(f(req, res, next))
      .catch((e) => next(e || new Error()));
  };
}

app.get('/messages', asyncWrap(getMessages));
app.get('/messages/:id', asyncWrap(getMessage));
app.put('/messages/:id', express.json(), asyncWrap(putMessage));
app.post('/messages', uploader.single('avatar'), express.json(), asyncWrap(postMessage));

app.listen(8080);
