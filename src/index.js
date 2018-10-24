import Koa from 'koa';
import Router from 'koa-router';
import cors from 'kcors';
import parser from 'koa-bodyparser';
import axios from 'axios';

const app = new Koa();
app.use(parser());
const router = new Router();

const eventsUrl = 'https://lego.abakus.no/api/v1/events/';

const departuresUrl = 'https://atbapi.tar.io/api/v1/departures/'

const busStops = [
  {id: '16011265', direction: 'to', stop: 'glos'},
  {id: '16010265', direction: 'from', stop: 'glos'},
  {id: '16011376', direction: 'to', stop: 'prof'},
  {id: '16010376', direction: 'from', stop: 'prof'},
];

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

const bus = async (ctx) => {
  const departuresList = await Promise.all(busStops.map((stop) => axios.get(departuresUrl + stop.id)));

  const stops = departuresList.map(stop => stop.data.departures);

  const returnData = {
    to: { },
    from: {},
  };

  stops.forEach((departures, index) => {
    returnData[busStops[index].direction][busStops[index].stop] = departures;
  })


  ctx.body = returnData;
};

router.get('/events', events);
router.get('/bus', bus);

app.use(cors());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
