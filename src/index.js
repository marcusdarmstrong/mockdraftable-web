import express from 'express';
import path from 'path';
import compression from 'compression';
import favicon from 'serve-favicon';

const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(compression());
app.use('/public', express.static(path.join(__dirname, '..', 'public'), {
  maxAge: 1000 * 60 * 60 * 24 * 365, // one year
}));
app.use(favicon(`${__dirname}/../public/favicon.ico`));
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(app.get('port'));
