'use strict';
const config = require('./config.json');
const Postgres = require('pg').Client;

const sql = new Postgres(config);
sql.connect();

sql.on('error', (err) => {
  console.error('SQL Fail', err);
  sql.end();
});

async function listMessages() {
  const q = 'SELECT * FROM Messageboard ORDER BY time DESC LIMIT 10;';
  const result = await sql.query(q);
  return result.rows;
}

async function findMessage(id) {
  const q = 'SELECT * FROM Messageboard WHERE id = $1;';
  const result = await sql.query(q, [id]);
  return result.rows[0];
}

async function addMessage(msg) {
  const q = 'INSERT INTO Messageboard (msg) VALUES ($1);';
  await sql.query(q, [msg]);
  return listMessages();
}

async function editMessage(updatedMessage) {
  const q = 'UPDATE Messageboard SET msg = $1 WHERE id = $2;';
  await sql.query(q, [updatedMessage.msg, updatedMessage.id]);
  return findMessage(updatedMessage.id);
}

module.exports = {
  listMessages,
  findMessage,
  addMessage,
  editMessage,
};
