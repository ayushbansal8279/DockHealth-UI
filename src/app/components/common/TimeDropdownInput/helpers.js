import moment from 'moment';
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';

const TIME_12H_FORMAT_REGULAR_EXPRESSION = /^(1[0-2]|0{0,1}[1-9]):([0-5]\d) [APap][Mm]$/;

export function isTimeInputEmpty(value) {
  return !value || value === '' || value === '__:__ __';
}

export function isTimeValid(value) {
  return TIME_12H_FORMAT_REGULAR_EXPRESSION.test(value);
}

export function generateTimeOptions() {
  const currentHour = moment();
  if (currentHour.get('minutes') >= 30) {
    currentHour.startOf('hour').add(30, 'minutes');
  } else {
    currentHour.startOf('hour');
  }

  return new Array(24).fill().reduce((accumulator, currentValue, index) => {
    accumulator.push(
      moment(currentHour)
        .add({ hours: index })
        .format(TIME_12H_FORMAT),
    );

    accumulator.push(
      moment(currentHour)
        .add({ hours: index, minutes: 30 })
        .format(TIME_12H_FORMAT),
    );
    return accumulator;
  }, []);
}
