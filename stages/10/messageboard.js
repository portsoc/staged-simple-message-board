import { initDb } from '../../db-utils.js';
import uuid from 'uuid-random';

function init() {
  return initDb('./database.sqlite', './migrations-sqlite');
}

const dbConn = init();

export async function listMessages() {
  const db = await dbConn;
  return db.all('SELECT * FROM Messages ORDER BY time DESC LIMIT 10');
}

export async function findMessage(id) {
  const db = await dbConn;
  return db.get('SELECT * FROM Messages WHERE id = ?', id);
}

function currentTime() {
  return new Date().toISOString();
}

export async function addMessage(msg) {
  if (msg.trim() === '') return listMessages();
  const db = await dbConn;
  const id = uuid();
  const time = currentTime();
  await db.run('INSERT INTO Messages VALUES (?, ?, ?)', [id, msg, time]);

  return listMessages();
}

export async function editMessage(id, updatedMessage) {
  const db = await dbConn;

  const time = currentTime();
  const msg = updatedMessage.msg;

  const statement = await db.run('UPDATE Messages SET msg = ? , time = ? WHERE id = ?', [msg, time, id]);

  // if nothing was updated, the ID doesn't exist
  if (statement.changes === 0) throw new Error('message not found');

  return findMessage(id);
}
