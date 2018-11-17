import Koa from 'koa';
import cors from 'kcors';
import parser from 'koa-bodyparser';
import router from './routes';

const app = new Koa();
app.use(parser());

app.use(cors());

app.use(router.routes());

app.listen(3000);
console.log('Listening on port 3000');
