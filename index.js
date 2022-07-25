import * as Sentry from '@sentry/node';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { MongoClient } from 'mongodb';

const PORT = 3000;

const app = express();
const mongoClient = new MongoClient('mongodb://localhost:27017');

Sentry.init({
  dsn: '<SENTRY_DSN>'
});

app.use(Sentry.Handlers.requestHandler());

app.get("/debug-sentry", (req, res) => {
  // 3. This will include HTTP request info
  throw new Error("My first Sentry error!");
});

app.get('/debug-sentry-mongo', asyncHandler(async (req, res) => {
  // 2. This will **not** include HTTP request info
  mongoClient
    .db('test')
    .collection('users')
    .findOne({ foo: 'bar' }, (err, user) => {
      console.log(user.name);
    });
}));

app.get('/debug-sentry-mongo-promise', asyncHandler(async (req, res) => {
  // 3. This will include HTTP request info
  const user = await mongoClient
    .db('test')
    .collection('users')
    .findOne({ foo: 'bar' });
  console.log(user.name);
}));

app.get('/debug-sentry-callback', (req, res) => {
  // 4. This will **not** include HTTP request info
  setTimeout(() => {
    throw new Error('From callback');
  }, 200);
});

app.use(Sentry.Handlers.errorHandler());
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

async function run() {
  await mongoClient.connect();
  app.listen(PORT, () => {
    console.log(`Debug app listening on port ${PORT}`)
  });
}

run();
