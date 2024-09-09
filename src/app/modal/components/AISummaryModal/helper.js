import moment from 'moment';

export function separateTimestamp(inputString) {
  const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
  const match = inputString.match(timestampRegex);

  if (match) {
    const timestamp = match[0];
    console.log(timestamp);
    
    let remainingString = inputString.slice(timestamp.length + 1).trim();

    remainingString = remainingString.replace(/^"|"$/g, '');

    return {
      timestamp: timestamp,
      remainingString: remainingString,
    };
  } else {
    return {
      timestamp: null,
      remainingString: inputString,
    };
  }
}

export function calculateResponseTimeAgo(timestamp) {
  const givenTime = moment(timestamp);
  const now = moment();
  const diff = moment.duration(now.diff(givenTime));

  const units = [
    { name: 'year', seconds: 31536000, singular: 'year', plural: 'years' },
    { name: 'month', seconds: 2592000, singular: 'month', plural: 'months' },
    { name: 'day', seconds: 86400, singular: 'day', plural: 'days' },
    { name: 'hour', seconds: 3600, singular: 'hour', plural: 'hours' },
    { name: 'minute', seconds: 60, singular: 'minute', plural: 'minutes' },
    { name: 'second', seconds: 1, singular: 'second', plural: 'seconds' },
  ];

  for (let unit of units) {
    const value = Math.floor(diff.asSeconds() / unit.seconds);
    if (value >= 1) {
      return `${value} ${value === 1 ? unit.singular : unit.plural} ago`;
    }
  }

  return 'just now';
}