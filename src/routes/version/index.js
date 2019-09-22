import Router from 'koa-router';

const version = async (ctx) => {
  const returnData = {
    version: '1.0.0',
  };
  ctx.body = returnData;
};

const router = new Router();

router.get('/', version);


export default router;
