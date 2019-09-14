import axios from 'axios';
import Router from 'koa-router';

const departuresUrl = 'https://atbapi.tar.io/api/v1/departures/';

const busStops = [
  { id: '16011265', direction: 'to', stop: 'glos' },
  { id: '16010265', direction: 'from', stop: 'glos' },
  { id: '16011026', direction: 'to', stop: 'Hesthagen' },
  { id: '16010026', direction: 'from', stop: 'Hesthagen' },
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
