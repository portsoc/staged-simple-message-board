-- Up

CREATE TABLE Messages (
  id   CHAR(36) PRIMARY KEY,
  msg  TEXT     NOT NULL,
  time DATETIME
);

INSERT INTO Messages (id, msg, time) VALUES
( 'xnshfdsafasd',
  'these are three default messages',
  datetime('now')),
( 'dskjdshkjhsd',
  'delivered from the server',
  datetime('now')),
( 'vcxbxcvfggzv',
  'using a custom route',
  datetime('now'));


-- Down

DROP TABLE Messages;
