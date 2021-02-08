import config from './config.js';
import Postgres from 'pg';

const sql = new Postgres.Client(config);
sql.connect();

sql.on('error', (err) => {
  console.error('SQL Fail', err);
  sql.end();
});

export async function listMessages() {
  const q = 'SELECT * FROM Messageboard ORDER BY time DESC LIMIT 10;';
  const result = await sql.query(q);
  return result.rows;
}

export async function findMessage(id) {
  const q = 'SELECT * FROM Messageboard WHERE id = $1;';
  const result = await sql.query(q, [id]);
  return result.rows[0];
}

export async function addMessage(msg) {
  const q = 'INSERT INTO Messageboard (msg) VALUES ($1);';
  await sql.query(q, [msg]);
  return listMessages();
}

export async function editMessage(updatedMessage) {
  const q = 'UPDATE Messageboard SET msg = $1 WHERE id = $2;';
  await sql.query(q, [updatedMessage.msg, updatedMessage.id]);
  return findMessage(updatedMessage.id);
}
