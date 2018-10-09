import Koa from 'koa';
import Router from 'koa-router';
import cors from 'kcors';

const app = new Koa();
const router = new Router();

const hello = async (ctx) => {
  ctx.body = 'hello world';
};

router.get('/hello', hello);

app.use(cors());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
