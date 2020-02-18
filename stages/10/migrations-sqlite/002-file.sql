-- Up

ALTER TABLE Messages ADD COLUMN file TEXT;

-- Down

CREATE TABLE Messages2 (
  id   CHAR(36) PRIMARY KEY,
  msg  TEXT     NOT NULL,
  time DATETIME
);

INSERT INTO Messages2 (id, msg, time)
SELECT id, msg, time FROM Messages;

DROP TABLE Messages;

ALTER TABLE Messages2 RENAME TO Messages;
