import moment from 'moment';

export function convertFilterToPayload(filter, organizationIdentifier) {
  const payload = {
    meteringEventQuery: {
      organizationIdentifier: organizationIdentifier,
      properties: {},
    },
  };

  for (const key in filter) {
    if (filter[key]?.options && Array.isArray(filter[key].options)) {
      if (key === 'eventTypes') {
        payload.meteringEventQuery.properties.types = filter[key].options;
      } else if (key === 'eventSubTypes') {
        payload.meteringEventQuery.properties.subtypes = filter[key].options;
      } else if (key === 'eventDateOptions') {
        const eventDateOptions = filter[key];

        if (eventDateOptions.dateStart && eventDateOptions.dateEnd) {
          payload.start = moment(eventDateOptions.dateStart).toISOString();
          payload.end = moment(eventDateOptions.dateEnd).toISOString();
        } else {
          const dateOption =
            eventDateOptions.options[filter[key].options.length - 1];
          const now = moment();

          switch (dateOption) {
            case 'TODAY':
              payload.start = now.startOf('day').toISOString();
              payload.end = now.endOf('day').toISOString();
              break;
            case 'YESTERDAY':
              payload.start = now
                .subtract(1, 'day')
                .startOf('day')
                .toISOString();
              payload.end = now.subtract(0, 'day').endOf('day').toISOString();
              break;
            case 'THIS_WEEK':
              payload.start = now.startOf('week').toISOString();
              payload.end = now.endOf('week').toISOString();
              break;
            case 'THIS_MONTH':
              payload.start = now.startOf('month').toISOString();
              payload.end = now.endOf('month').toISOString();
              break;
            default:
              break;
          }
        }
      }
    }
  }

  return payload;
}
