import React, { createContext, PropsWithChildren } from 'react';
import { IAmplitudeContext } from '@/app/types/amplitude';
import { useInitAmplitude } from './amplitude-hooks';

export const AmplitudeContext = createContext({} as IAmplitudeContext);

export const AmplitudeContextProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const amplitudeSdk = useInitAmplitude();

  return (
    <AmplitudeContext.Provider value={{ amplitudeSdk }}>
      {children}
    </AmplitudeContext.Provider>
  );
};
