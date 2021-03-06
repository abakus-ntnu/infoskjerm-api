import Koa from 'koa';
import cors from '@koa/cors';
import parser from 'koa-bodyparser';
import logger from 'koa-logger';
import router from './routes';

const app = new Koa();

app.use(logger());
app.use(parser());
app.use(cors({ origin: '*' }));

app.use(router.routes());

app.listen(3000);
console.log('Listening on port 3000');
