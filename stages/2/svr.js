// message board app
// stage 2: add route for getting messages
import express from 'express';

const app = express();
app.use(express.static('client'));

const messages = [
  'these are three default messages',
  'delivered from the server',
  'using a custom route',
];

function getMessages(req, res) {
  res.json(messages);
}

app.get('/messages', getMessages);

app.listen(8080);
