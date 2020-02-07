// message board app
// stage 3: add route for posting new messages
const express = require('express');
const uuid = require('uuid/v1');
const app = express();

app.use(express.static('client'));

let messages = [
  {id: "1", msg: "these are three default messages"},
  {id: "2", msg: "delivered from the server"},
  {id: "3", msg: "using a custom route"}
];

app.get("/messages", (req, res) => {
  res.json(messages);
});


app.get("/messages/:id", (req, res) => {
  for (const message of messages) {
    if (message.id === req.params.id) {
      res.json(message);      
    }
  }
  res.status(404).send("No match for that ID.")
});


app.post("/messages", express.json(), (req, res) => {
  messages = [req.body.msg, ...messages.slice(0,9)];
  res.json(messages);
});

app.listen(8080);
