import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import helmet from 'helmet';
import routes from './routes';
import { auth } from './auth';

const app = express();

app.use(helmet());
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  expressSession({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true })
);

app.use(auth);

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(err.status || 500).send(err.message);
});

export default app;
