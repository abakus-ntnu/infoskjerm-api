import Router from 'koa-router';
import { getRealtimeBuses } from 'utils';
import { stops } from 'constants';

let busCache;


const getBusTimes = async () => {
  const glos = await getRealtimeBuses(stops[0]);
  const hest = await getRealtimeBuses(stops[1]);

  busCache = { glos, hest };
};

getBusTimes();
setInterval(getBusTimes, 10 * 1000);

const bus = async (ctx) => {
  ctx.body = busCache;
};

const router = new Router();
router.get('/', bus);


export default router;
