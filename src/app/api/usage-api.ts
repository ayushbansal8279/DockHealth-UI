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

const sendEvent = async (data: SendEventProps) => {
  let captureEvent = true;
  if (
    data &&
    data.eventAction &&
    (data.eventAction.includes('login') ||
      data.eventAction.includes('loginUser') ||
      data.eventAction.includes('welcome') ||
      data.eventAction.includes('logout') ||
      data.eventAction.includes('resendCode') ||
      data.eventAction.includes('forgotPassword') ||
      data.eventAction.includes('changePassword') ||
      data.eventAction.includes('resetPassword') ||
      data.eventAction.includes('changePhoneNumber') ||
      data.eventAction.includes('confirmMFACode') ||
      data.eventAction.includes('resetPasswordEmailSent') ||
      data.eventAction.includes('resetPasswordSuccess') ||
      data.eventAction.includes('confirmRegistration') ||
      data.eventAction.includes('confirmRegistrationSuccess') ||
      data.eventAction.includes('create-account'))
  ) {
    captureEvent = false;
  }
  if (captureEvent) {
    try {
      await axios({
        method: 'post',
        url: '/usage/event',
        data,
      });
    } catch {
      // do nothing
    }
  }

  ReactGA.event(
    {
      category: data.eventCategory,
      action: data.eventAction,
      label: data.eventLabel,
    },
    ['webapp'],
  );

  ReactGA.event(
    {
      category: data.eventCategory,
      action: data.eventAction,
      label: data.eventLabel,
    },
    ['rollup'],
  );
};

export default sendEvent;
