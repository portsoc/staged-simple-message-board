"use strict";

// message board app
// stage 5: refactor to separate http/web code from core logic
const express = require('express');
const app = express();
const mb = require('./messageboard');

app.use(express.static('client'));

app.get("/messages", (req, res) => {
  res.json(mb.getMessages());
});

app.get("/messages/:id", (req, res) => {
  let result = mb.getMessage(req.params.id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send("No match for that ID.")
  }
});

app.post("/messages", express.json(), (req, res) => {
  const messages = mb.addMessage(req.body.msg);
  res.json(messages);
});

app.listen(8080);
