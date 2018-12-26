import axios from 'axios';
import Router from 'koa-router';

const departuresUrl = 'https://infoskjerm-api.koskom.no/bus/';

const busStops = [
  { id: '16011265', direction: 'to', stop: 'glos' },
  { id: '16010265', direction: 'from', stop: 'glos' },
  { id: '16011376', direction: 'to', stop: 'prof' },
  { id: '16010376', direction: 'from', stop: 'prof' },
];

const dateToFormattedMinutes = (date) => {
  const minutes = date.getMinutes();
  return minutes.toString().length <= 1 ? `0${minutes}` : minutes;
};

const formattedTimeToDeparture = (departureTime, diffMinutes) => {
  if (diffMinutes <= 1) {
    return 'Nå';
  }
  if (diffMinutes <= 10) {
    return `${diffMinutes} min`;
  }
  if (diffMinutes > 10) {
    return `${departureTime.getHours()}:${dateToFormattedMinutes(departureTime)}`;
  }
  return diffMinutes;
};

const calculateTimeUntilDeparture = (currentTime, departureTimeString) => {
  const departureTime = new Date(departureTimeString);
  const timeDiff = Math.abs(departureTime.getTime() - currentTime.getTime());
  const diffMinutes = Math.ceil(timeDiff / (1000 * 60));
  return formattedTimeToDeparture(departureTime, diffMinutes);
};

const arrayOfBusStopPromises = () => busStops.map(stop => axios.get(departuresUrl + stop.id));

const bus = async (ctx) => {
  const departuresList = await Promise.all(arrayOfBusStopPromises());

  const stops = departuresList.map(stop => stop.data.departures);

  const returnData = {
    to: {},
    from: {},
  };
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 1);

  stops.forEach((departures, index) => {
    returnData[busStops[index].direction][busStops[index].stop] = departures
      .map(departure => ({
        ...departure,
        ...{
          timeUntilDeparture: calculateTimeUntilDeparture(
            currentTime, departure.registeredDepartureTime,
          ),
        },
      }));
  });

  ctx.body = returnData;
};

const router = new Router();

router.get('/', bus);


export default router;