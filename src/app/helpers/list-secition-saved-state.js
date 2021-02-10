/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useState } from 'react';
import sessionStorageHelper from 'helpers/session-storage-helper';

export const FULL_VIEW = 'FULL_VIEW';
export const SLIM_VIEW = 'SLIM_VIEW';

const DEFAULT_IS_OPEN_STATE = true;
const DEFAULT_VIEW_TYPE = SLIM_VIEW;

const listSectionSavedState = ({ sessionStorageKey }) => {
  const storageState = useMemo(
    () => sessionStorageHelper.getItem(sessionStorageKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [isOpen, switchOpen] = useState(
    storageState && (storageState.isOpen || storageState.isOpen === false)
      ? storageState.isOpen
      : DEFAULT_IS_OPEN_STATE,
  );
  const [viewType, setViewType] = useState(
    storageState?.viewType || DEFAULT_VIEW_TYPE,
  );

  useEffect(() => {
    if (isOpen === DEFAULT_IS_OPEN_STATE && viewType === DEFAULT_VIEW_TYPE) {
      sessionStorageHelper.removeItem(sessionStorageKey);
    } else {
      // sessionStorageHelper.setItem(sessionStorageKey, {
      //   isOpen,
      //   viewType,
      // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, viewType]);

  return {
    isOpen,
    switchOpen,
    viewType,
    setViewType,
  };
};

export default listSectionSavedState;
