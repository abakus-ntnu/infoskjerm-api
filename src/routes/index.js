import Router from 'koa-router';
import busRouter from './bus';
import eventsRouter from './events';


const router = new Router();
router.use('/bus', busRouter.routes(), busRouter.allowedMethods());
router.use('/events', eventsRouter.routes(), eventsRouter.allowedMethods());


export default router;
