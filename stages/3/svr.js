// message board app
// stage 3: add route for posting new messages
const express = require('express');
const app = express();
app.use(express.static('client'));

let messages = [
  "these are three default messages",
  "delivered from the server",
  "using a custom route"
];

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/messages", express.json(), (req, res) => {
  messages = [req.body.msg, ...messages.slice(0,9)];
  res.json(messages);
});

// yes we can generate html, but we don't
app.get("/crazy/html/path", (req, res) => {
  res.send("<!doctype html><title>x</title><h1>hello mum</h1>");
});


app.listen(8080);
