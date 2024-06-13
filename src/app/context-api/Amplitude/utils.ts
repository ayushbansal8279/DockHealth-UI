import { ampli } from '@/ampli';
import { IAmplitudeSdk } from '@/app/types/amplitude';
import { useEffect, useState } from 'react';

export const useInitAmplitude = (): IAmplitudeSdk => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    ampli
      .load({
        client: {
          apiKey: import.meta.env.VITE_AMPLITUDE_API_KEY,
          configuration: {
            /**
             * We're overriding the endpoint url that the Amplitude Analytics
             * SDK uses to submit user events data. Because ad blockers will block,
             * these requests we instead point these requests to our own domain, which
             * is just a CNAME to the actual amplitude analytics endpoint.
             * This is the base url that's being replaced:
             *  https://api2.amplitude.com/2/httpapi
             * Note: We do need to append the path suffix to this url. If we ever want
             * to enabled `useBatch: true`, which would use `/batch`, then we'll have
             * to use a more robust transportProvider config instead.
             * Note: only override it if there is a specified url from env.
             */
            ...(!!import.meta.env.VITE_AMPLI_ANALYTICS_URL
              ? { serverUrl: import.meta.env.VITE_AMPLI_ANALYTICS_URL }
              : {}),
            attribution: {
              trackNewCampaigns: true,
              trackPageViews: true,
            },
          },
        },
      })
      .promise.then(() => setInitialized(true));
  }, []);

  return {
    initialized,
  };
};
