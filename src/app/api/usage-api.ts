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

const sendEvent = (data: SendEventProps) =>
  axios({
    method: 'post',
    url: '/usage/event',
    data,
  });

export default sendEvent;
