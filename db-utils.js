import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// promise-based wrapper around a better-sqlite3 Database instance
export function promiseWrapper(db) {
  return {
    run: (sql, ...params) => new Promise((resolve, reject) => {
      try {
        const r = db.prepare(sql).run(...params);
        resolve(r);
      } catch (e) {
        reject(e);
      }
    }),
    exec: (sql) => new Promise((resolve, reject) => {
      try {
        resolve(db.exec(sql));
      } catch (e) {
        reject(e);
      }
    }),
    all: (sql, ...params) => new Promise((resolve, reject) => {
      try {
        resolve(db.prepare(sql).all(...params));
      } catch (e) {
        reject(e);
      }
    }),
    get: (sql, ...params) => new Promise((resolve, reject) => {
      try {
        resolve(db.prepare(sql).get(...params));
      } catch (e) {
        reject(e);
      }
    }),
    close: () => new Promise((resolve, reject) => {
      try {
        resolve(db.close());
      } catch (e) {
        reject(e);
      }
    }),
  };
}

export async function readMigrations(migrationPath) {
  const migrationsPath = migrationPath || path.join(process.cwd(), 'migrations');
  const location = path.resolve(migrationsPath);
  const migrationFiles = await new Promise((resolve, reject) => {
    fs.readdir(location, (err, files) => {
      if (err) {
        return reject(err);
      }
      resolve(files
        // support `001-name.sql` or `001.name.sql`
        .map(x => x.match(/^(\d+)[.-](.*?)\.sql$/))
        .filter(x => x !== null)
        .map(x => ({ id: Number(x[1]), name: x[2], filename: x[0] }))
        .sort((a, b) => Math.sign(a.id - b.id)));
    });
  });
  if (!migrationFiles.length) {
    throw new Error(`No migration files found in '${location}'.`);
  }
  return Promise.all(migrationFiles.map(migration => new Promise((resolve, reject) => {
    const filename = path.join(location, migration.filename);
    fs.readFile(filename, 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }
      const [up, down] = data.split(/^--\s+?down\b/im);
      const migrationData = migration;
      migrationData.up = up.replace(/^-- .*?$/gm, '').trim();
      migrationData.down = down ? down.trim() : '';
      resolve(migrationData);
    });
  })));
}

export async function migrate(db, config = {}) {
  config.force = config.force || false;
  config.table = config.table || 'migrations';
  const { force, table } = config;
  const migrations = config.migrations
    ? config.migrations
    : await readMigrations(config.migrationsPath);
  await db.run(`CREATE TABLE IF NOT EXISTS "${table}" (
  id   INTEGER PRIMARY KEY,
  name TEXT    NOT NULL,
  up   TEXT    NOT NULL,
  down TEXT    NOT NULL
)`);
  let dbMigrations = await db.all(`SELECT id, name, up, down FROM "${table}" ORDER BY id ASC`);
  const lastMigration = migrations[migrations.length - 1];
  for (const migration of dbMigrations
    .slice()
    .sort((a, b) => Math.sign(b.id - a.id))) {
    if (!migrations.some(x => x.id === migration.id) ||
      (force && migration.id === lastMigration.id)) {
      await db.run('BEGIN');
      try {
        await db.exec(migration.down);
        await db.run(`DELETE FROM "${table}" WHERE id = ?`, migration.id);
        await db.run('COMMIT');
        dbMigrations = dbMigrations.filter(x => x.id !== migration.id);
      } catch (err) {
        await db.run('ROLLBACK');
        throw err;
      }
    } else {
      break;
    }
  }
  const lastMigrationId = dbMigrations.length
    ? dbMigrations[dbMigrations.length - 1].id
    : 0;
  for (const migration of migrations) {
    if (migration.id > lastMigrationId) {
      await db.run('BEGIN');
      try {
        await db.exec(migration.up);
        await db.run(`INSERT INTO "${table}" (id, name, up, down) VALUES (?, ?, ?, ?)`, migration.id, migration.name, migration.up, migration.down);
        await db.run('COMMIT');
      } catch (err) {
        await db.run('ROLLBACK');
        throw err;
      }
    }
  }
}

export async function initDb(dbFile = './database.sqlite', migrationsPath = './migrations-sqlite') {
  const rawDb = new Database(dbFile);
  const db = promiseWrapper(rawDb);
  await migrate(db, { migrationsPath });
  return db;
}
