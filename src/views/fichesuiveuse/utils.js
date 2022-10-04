// this file contains functions about machine status based on functional programming style

// package for working with dates
import { set } from 'date-fns';
import moment, { duration } from 'moment';

const now = new Date();

// get date
export const getTodayAtSpecificHour = (hour = 8, minutes = 0) =>
  set(now, { hours: hour, minutes: minutes, seconds: 0, milliseconds: 0 });

// get Hours from date
export function getHours(date) {
  if (!date) return new Date().getHours();
  return new Date(date).getHours();
}

// get Minutes from date
export function getMinutes(date) {
  if (!date) return new Date().getMinutes();
  return new Date(date).getMinutes();
}

// get Seconds from date
export function getSeconds(date) {
  if (!date) return new Date().getSeconds();
  return new Date(date).getSeconds();
}

// get full time
export function getFullTime(time) {
  let hours = getHours(time);
  let minutes = getMinutes(time);
  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;

  return `${hours}:${minutes}`;
}

// push element in a table
export function push(tab, element) {
  return [...tab, element];
}

// remove element from a table
export function remove(tab, element) {
  return tab.filter((el) => el !== element);
}

// remove element from a table
export function concatTabs(tab1, tab2) {
  return tab1.concat(tab2);
}

// check if an element exists inside a table or not
export function isExist(tab, element) {
  return tab.findIndex((el) => el === element) !== -1;
}

// push or remove the element
export function handleOpenConfig(tab, element) {
  return isExist(tab, element) ? remove(tab, element) : push(tab, element);
}

// get the quart time line interval
export function getQuartInterval(start, end) {
  return [
    getTodayAtSpecificHour(getHours(start), getMinutes(start)),
    getTodayAtSpecificHour(getHours(end), getMinutes(end)),
  ];
}

// get perte intervals
export function getPerteintervals(tab, pId) {
  return tab.filter((element) => element.pId === pId);
}

// get category intervals
export function getCategoryintervals(tab, cId) {
  return tab.filter((element) => element.cId === cId);
}

// get cause intervals
export function getCauseintervals(tab, causeId) {
  return tab.filter((element) => element.causeId === causeId);
}

// get hours and minutes from number of hours
export function getHoursMunites(tab) {
  let sum = 0;
  tab.map((t) => {
    sum = sum + t.time * 60;
  });

  let hours = 0;
  while (sum > 59) {
    hours = hours + 1;
    sum = sum - 60;
  }

  return [hours, sum];
}

// calculate time from table of
export function calculateTime(tab) {
  let hours = 0;
  let minutes = 0;
  tab.map((element) => {
    let diffInMilliSeconds = Math.abs(new Date(element.end) - new Date(element.start)) / 1000;
    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const h = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= h * 3600;

    // calculate minutes
    const m = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= m * 60;

    hours = hours + h;
    minutes = minutes + m;

    if (minutes > 59) {
      hours = hours + 1;
      minutes = minutes - 60;
    }
  });

  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  return hours + ':' + minutes + 'h';
}

// get Perte from configs non trg
export function getPerte(configs, pId) {
  if (pId === 0) return { label: 'Cycle Standard' };
  if (configs.length === 0) return '';
  return configs[pId - 1];
}

// get catgory from configs non trg
export function getCategory(configs, pId, cId) {
  if (cId === 0) return { label: '' };
  return configs[pId - 1].categories?.find((category) => category.id === cId);
}

// get cause from configs non trg
export function getCause(configs, pId, cId, causeId) {
  if (causeId === 0) return { label: '' };
  return configs[pId - 1].categories
    .find((category) => category.id === cId)
    .causes.find((cause) => cause.id === causeId);
}

//check if the data of machine status correction is valid
export function checkData(array) {
  const metaArray = array.map((slice) => ({
    start: new Date(slice.start).setSeconds(0, 0),
    end: new Date(slice.end).setSeconds(0, 0),
  }));

  const report = metaArray.filter(({ start, end }, i) => start <= end && (!i || start === metaArray[i - 1].end));
  return report.length === array.length;
}

export function getDiffrenceInHours(date1, date2) {
  const startTime = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), getHours(date1)),
  );
  const endTime = moment(date2);
  const hours = moment.duration(endTime.diff(startTime)).asHours();
  return parseInt(hours);
}

export function checkLimit(limit, dateCompare) {
  let minutes = limit * 60;

  let hours = 0;
  while (minutes > 59) {
    hours = hours + 1;
    minutes = minutes - 60;
  }

  let date = new Date().setHours(getHours(dateCompare) + hours);
  if (getMinutes() + minutes > 59) {
    date = new Date(date).setHours(getHours(dateCompare) + 1);
    date = new Date(date).setMinutes(0);
  } else {
    date = new Date(date).setMinutes(getMinutes(dateCompare) + minutes);
  }

  date = new Date(date).toISOString();
  const diff = moment.duration(moment(date).diff(moment(new Date()))).asSeconds();
  console.log('date ', date);
  console.log('diff ', dateCompare);
  if (diff > 0) return true;
  return false;
}

// calculate duration between two dates

export function setduration(end) {
  const now = new Date();
  // start time and end time
  var startTime = moment(moment(now), 'HH:mm:ss a');
  var endTime = moment(moment(end), 'hh:mm:ss a');
  // calculate total duration
  var duration = moment.duration(startTime.diff(endTime));
  console.log('durationnnnnnnn', duration);
  console.log('diffff', Math.abs(endTime.diff(startTime)));
  // duration in hours
  var hours = Math.abs(parseInt(duration.asHours()));
  // duration in minutes
  var minutes = Math.abs(parseInt(duration.asMinutes()) % 60);

  return ' ' + hours + ':' + minutes + '';
}

export function setdurationquart(d, e) {
  // start time and end time
  var startTime = moment(moment(d).format('LTS'), 'HH:mm:ss a');
  var endTime = moment(moment(e).format('LTS'), 'HH:mm:ss a');
  // calculate total duration
  var duration = moment.duration(endTime.diff(startTime));
  // duration in minutes
  var minutes = parseInt(duration.asSeconds());
  return minutes;
}
