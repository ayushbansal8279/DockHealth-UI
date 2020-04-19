import ReactGA from 'react-ga';
import axios from './axios-heydoc';

interface SendEventProps {
  eventAction: string;
  eventCategory: string;
  eventLabel?: string;
  metaData?: Array<{
    name: string;
    value: string;
  }>;
  usageEventType: 'PAGE_VIEW' | 'USAGE_ACTION';
}

const sendEvent = (data: SendEventProps) => {
  axios({
    method: 'post',
    url: '/usage/event',
    data,
  });

  ReactGA.event({
    category: data.eventCategory,
    action: data.eventAction,
    label: data.eventLabel,
  });
};

export default sendEvent;
