'use strict';
const uuid = require('uuid-random');
const sqlite = require('sqlite');

async function init() {
  const db = await sqlite.open('./database.sqlite', { verbose: true });
  await db.migrate({ migrationsPath: './migrations-sqlite' });
  return db;
}

const dbPromise = init();

async function listMessages() {
  const db = await dbPromise;
  return db.all('SELECT * FROM Messages ORDER BY time DESC LIMIT 10');
}

async function findMessage(id) {
  const db = await dbPromise;
  return db.get('SELECT * FROM Messages WHERE id = ?', id);
}

function currentTime() {
  return new Date().toISOString();
}

async function addMessage(msg) {
  const db = await dbPromise;

  const id = uuid();
  const time = currentTime();
  await db.run('INSERT INTO Messages VALUES (?, ?, ?)', [id, msg, time]);

  return listMessages();
}

async function editMessage(updatedMessage) {
  const db = await dbPromise;

  const id = updatedMessage.id;
  const time = currentTime();
  const msg = updatedMessage.msg;

  const statement = await db.run('UPDATE Messages SET msg = ? , time = ? WHERE id = ?', [msg, time, id]);

  // if nothing was updated, the ID doesn't exist
  if (statement.changes === 0) throw new Error('message not found');

  return findMessage(id);
}

module.exports = {
  listMessages,
  findMessage,
  addMessage,
  editMessage,
};
