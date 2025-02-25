import uuid from 'uuid-random';

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

export function listMessages() {
  return messages;
}

export function findMessage(id) {
  for (const message of messages) {
    if (message.id === id) {
      return message;
    }
  }
  return null;
}

export function addMessage(msg) {
  const newMessage = {
    id: uuid(),
    time: Date(),
    msg,
  };
  messages = [newMessage, ...messages.slice(0, 9)];
  return messages;
}
