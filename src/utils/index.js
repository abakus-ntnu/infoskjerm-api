import xRay from 'x-ray';
import moment from 'moment-timezone';


const formattedTimeToDeparture = (departureTime, diffMinutes) => {
  if (diffMinutes <= 1) {
    return 'Nå';
  }
  if (diffMinutes <= 10) {
    return `${diffMinutes} min`;
  }
  if (diffMinutes > 10) {
    return departureTime;
  }
  return diffMinutes;
};

const minutesSinceMidnight = time => parseInt(time.substring(0, 2), 10) * 60
  + parseInt(time.substring(3, 5), 10);

const differenceInMinutes = (currentTime, busTime) => {
  const currentTimeInMinutes = minutesSinceMidnight(currentTime);
  const busTimeInMinutes = minutesSinceMidnight(busTime);
  if (busTimeInMinutes - currentTimeInMinutes < 0) { return (busTime + 60 * 24) - currentTimeInMinutes; }
  return busTimeInMinutes - currentTimeInMinutes;
};

const formatTime = (currentTime, time) => {
  const diff = differenceInMinutes(currentTime, time);
  return formattedTimeToDeparture(time, diff);
};

const x = xRay({
});

const formatBusStop = (list) => {
  const { hasrealtime, nonrealtime } = list;
  const final = [];
  const currentTime = moment(new Date().toUTCString()).tz('Europe/Oslo').format('HH:mm');
  for (let i = 0; i < nonrealtime.length; i += 1) {
    const bus = nonrealtime[i];
    final[i] = {
      ...nonrealtime[i],
      ...{
        realtime: hasrealtime.some(el => (el.time === bus.time
          && el.number === bus.number && el.bus === bus.bus)),
      },
    };
    final[i].time = formatTime(currentTime, final[i].time.trim());
    final[i].bus = final[i].bus.trim();
    final[i].number = final[i].number.trim();
  }
  return final;
};

const getRealtimeBuses = async (stop) => {
  const result = await x(`https://rp.atb.no/scripts/TravelMagic/TravelMagicWE.dll/svar?dep1=1&from=${stop}`, {
    lists: x('ul.ui-helper-reset.tm-group-header-list', [{
      hasrealtime: x('li.ui-state-default.tm-overvaket', [{
        time: x('.tm-block-float.tm-departurelist-time'),
        bus: x('.tm-departurelist-destination.tm-alpha6'),
        number: x('.tm-departurelist-linename'),
      }]),
      nonrealtime: x('li.ui-state-default', [{
        time: x('.tm-block-float.tm-departurelist-time'),
        bus: x('.tm-departurelist-destination.tm-alpha6'),
        number: x('.tm-departurelist-linename'),
      }]),

    }]),
  }).then(res => res).catch((e) => {
    console.log(e);
    return e;
  });
  const formated = {
    from: formatBusStop(result.lists[0]),
    to: formatBusStop(result.lists[1]),
  };
  return formated;
};

// eslint-disable-next-line import/prefer-default-export
export { getRealtimeBuses };
