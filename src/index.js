import Koa from 'koa';
import Router from 'koa-router';
import cors from 'kcors';
import axios from 'axios';

const app = new Koa();
const router = new Router();

const eventsUrl = 'https://lego.abakus.no/api/v1/events/';

const dateString = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (`0${(currentDate.getMonth() + 1)}`).slice(-2);
  const currentDay = (`0${currentDate.getDay()}`).slice(-2);
  const dateAfter = `date_after=${currentYear}-${currentMonth}-${currentDay}`;
  const dateBefore = `date_before=${currentYear + 1}-${currentMonth}-${currentDay}`;
  return `?${dateAfter}&${dateBefore}&page_size=10`;
};

const events = async (ctx) => {
  const eventsFromAbakus = await axios.get(eventsUrl + dateString());
  const eventsArray = eventsFromAbakus.data.results;
  ctx.body = eventsArray;
};

router.get('/events', events);

app.use(cors());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
