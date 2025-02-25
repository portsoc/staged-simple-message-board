// message board app
// stage 3: add route for posting new messages
import express from 'express';

const app = express();
app.use(express.static('client'));

let messages = [
  'these are three default messages',
  'delivered from the server',
  'using a custom route',
];

function getMessages(req, res) {
  res.json(messages);
}

function postMessages(req, res) {
  messages = [req.body.msg, ...messages.slice(0, 9)];
  res.json(messages);
}

app.get('/messages', getMessages);
app.post('/messages', express.json(), postMessages);

app.listen(8080);
