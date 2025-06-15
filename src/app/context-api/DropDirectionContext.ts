import { createContext, useContext } from 'react';

export const DropDirectionContext = createContext<React.MutableRefObject<
  'top' | 'bottom' | null
> | null>(null);

export const useDropDirection = () => {
  return useContext(DropDirectionContext);
};
