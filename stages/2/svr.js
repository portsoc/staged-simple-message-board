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

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.listen(8080);
