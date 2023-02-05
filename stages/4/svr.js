// message board app
// stage 4: An API route for every message
import express from 'express';
import uuid from 'uuid-random';

const app = express();
app.use(express.static('client'));

let messages = [
  {
    id: 'xnshfdsafasd',
    msg: 'these are three default messages',
    time: 'an hour ago',
  },
  {
    id: 'dskjdshkjhsd',
    msg: 'delivered from the server',
    time: 'yesterday',
  },
  {
    id: 'vcxbxcvfggzv',
    msg: 'using a custom route',
    time: 'last week',
  },
];


function getMessages(req, res) {
  res.json(messages);
}


function getMessage(req, res) {
  for (const message of messages) {
    if (message.id === req.params.id) {
      res.json(message);
      return; // short
    }
  }
  res.status(404).send('No match for that ID.');
}

function postMessages(req, res) {
  const newMessage = {
    id: uuid(),
    msg: req.body.msg,
    time: Date(),
  };
  messages = [newMessage, ...messages.slice(0, 9)];
  res.json(messages);
}

app.get('/messages', getMessages);
app.get('/messages/:id', getMessage);
app.post('/messages', express.json(), postMessages);

app.listen(8080);
