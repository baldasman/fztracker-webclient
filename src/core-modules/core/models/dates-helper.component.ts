import * as momentTimezone from 'moment-timezone';

// TODO: These are CONSTANTS! NOT TO BE HERE!!!!
const formatTimezone = 'Europe/Lisbon';
const formatDateHourMin = 'YYYY/MM/DD HH:mm';


// TODO: Transform this in a model (just like url.model!!)
export const dateHourMinFormat = (date, userTimezone?) => (
  momentTimezone(date, 'x')
    .tz(userTimezone || formatTimezone)
    .format(formatDateHourMin)
);

export const timeAgoInWords = (date) => {
  return momentTimezone(date, 'x').fromNow();
};
