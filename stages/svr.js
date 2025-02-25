// message board app
// stage 1: basic web server
import express from 'express';

const app = express();
app.use(express.static('client'));
app.listen(8080);
