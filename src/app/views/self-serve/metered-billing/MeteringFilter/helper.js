import moment from 'moment';

export function convertFilterToPayload(
  filter,
  organizationIdentifier,
  offset,
  limit,
) {
  const payload = {
    meteringEventQuery: {
      organizationIdentifier,
      properties: {},
    },
    offset,
    limit,
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
        }
      }
    }
  }
  return payload;
}

export function determineDateOptions(filter) {
  if (filter?.eventDateOptions) {
    const eventDateOptions = filter?.eventDateOptions;
    const dateOption = eventDateOptions.options?.[0];
    let startDate = null;
    let endDate = null;
    switch (dateOption) {
      case 'TODAY':
        startDate = moment().startOf('day').toISOString();
        endDate = moment().startOf('day').add(1, 'day').toISOString();
        break;
      case 'YESTERDAY':
        startDate = moment().startOf('day').subtract(1, 'day').toISOString();
        endDate = moment().startOf('day').toISOString();
        break;
      case 'THIS_WEEK':
        startDate = moment().startOf('week').toISOString();
        endDate = moment().startOf('week').add(1, 'week').toISOString();
        break;
      case 'PREVIOUS_WEEK':
        startDate = moment().startOf('week').subtract(1, 'week').toISOString();
        endDate = moment().startOf('week').toISOString();
        break;
      case 'THIS_MONTH':
        startDate = moment().startOf('month').toISOString();
        endDate = moment().startOf('month').add(1, 'month').toISOString();
        break;
      case 'PREVIOUS_MONTH':
        startDate = moment()
          .startOf('month')
          .subtract(1, 'month')
          .toISOString();
        endDate = moment().startOf('month').toISOString();
        break;
      default:
        break;
    }
    return {
      ...filter,
      eventDateOptions: {
        ...filter.eventDateOptions,
        dateStart: startDate,
        dateEnd: endDate,
      },
    };
  }
  return filter;
}
