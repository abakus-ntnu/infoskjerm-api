import Router from 'koa-router';
import busRouter from './bus';
import eventsRouter from './events';
import versionRouter from './version';


const router = new Router();
router.use('/bus', busRouter.routes(), busRouter.allowedMethods());
router.use('/events', eventsRouter.routes(), eventsRouter.allowedMethods());
router.use('/version', versionRouter.routes(), versionRouter.allowedMethods());


export default router;
