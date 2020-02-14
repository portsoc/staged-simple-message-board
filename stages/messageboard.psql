CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS Messageboard;

CREATE TABLE IF NOT EXISTS Messageboard (
    id   uuid      DEFAULT uuid_generate_v4() PRIMARY KEY,
    time timestamp DEFAULT now(),
    msg  text
);

INSERT INTO Messageboard (msg) VALUES
( 'these are three default messages' ),
( 'delivered from the server' ),
( 'using a custom route' );
