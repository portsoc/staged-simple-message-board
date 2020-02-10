'use strict';
const uuid = require('uuid-random');

let messages = [
  { id: 'xnshfdsafasd', msg: 'these are three default messages', time: 'default' },
  { id: 'dskjdshkjhsd', msg: 'delivered from the server', time: 'default' },
  { id: 'vcxbxcvfggzv', msg: 'using a custom route', time: 'default' },
];

function getMessages() {
  return messages;
}

function getMessage(id) {
  for (const message of messages) {
    if (message.id === id) {
      return message;
    }
  }
  return null;
}

function addMessage(msg) {
  const newMessage = {
    id: uuid(),
    time: Date(),
    msg,
  };
  messages = [newMessage, ...messages.slice(0, 9)];
  return messages;
}

module.exports = {
  getMessages,
  getMessage,
  addMessage,
};
