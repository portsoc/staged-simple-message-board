export default {
  // remove the next line if not running on our VM and connection to PostgreSQL doesn't work
  host: '/var/run/postgresql',

  database: 'messageboard',
  statement_timeout: 5000,
};
