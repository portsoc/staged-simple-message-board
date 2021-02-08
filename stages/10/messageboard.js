import uuid from 'uuid-random';
import sqlite from 'sqlite';
import fs from 'fs';
import util from 'util';
import path from 'path';

fs.renameAsync = fs.renameAsync || util.promisify(fs.rename);

async function init() {
  const db = await sqlite.open('./database.sqlite', { verbose: true });
  await db.migrate({ migrationsPath: './migrations-sqlite' });
  return db;
}

const dbConn = init();

function addImagePath(message) {
  if (message.file) {
    message.avatar = '/images/' + message.file;
  }
}

export async function listMessages() {
  const db = await dbConn;
  const messages = await db.all('SELECT * FROM Messages ORDER BY time DESC LIMIT 10');
  messages.forEach(addImagePath);
  return messages;
}

export async function findMessage(id) {
  const db = await dbConn;
  const msg = db.get('SELECT * FROM Messages WHERE id = ?', id);
  addImagePath(msg);
  return msg;
}

function currentTime() {
  return new Date().toISOString();
}

export async function addMessage(msg, file) {
  let newFilename;
  if (file) {
    // we should first check that the file is actually an image
    // move the file where we want it
    const fileExt = file.mimetype.split('/')[1] || 'png';
    newFilename = file.filename + '.' + fileExt;
    await fs.renameAsync(file.path, path.join('client', 'images', newFilename));
  }

  const db = await dbConn;

  const id = uuid();
  const time = currentTime();
  await db.run('INSERT INTO Messages VALUES (?, ?, ?, ?)', [id, msg, time, newFilename]);

  return listMessages();
}

export async function editMessage(updatedMessage) {
  const db = await dbConn;

  const id = updatedMessage.id;
  const time = currentTime();
  const msg = updatedMessage.msg;

  const statement = await db.run('UPDATE Messages SET msg = ? , time = ? WHERE id = ?', [msg, time, id]);

  // if nothing was updated, the ID doesn't exist
  if (statement.changes === 0) throw new Error('message not found');

  return findMessage(id);
}
