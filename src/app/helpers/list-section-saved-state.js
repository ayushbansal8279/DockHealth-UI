import { useEffect, useMemo, useState } from 'react';
import sessionStorageHelper from 'helpers/session-storage-helper';
import { ViewType } from 'components/tasklist/ViewTypeSwitch/ViewTypeSwitch';

const DEFAULT_IS_OPEN_STATE = false;
const DEFAULT_VIEW_TYPE = ViewType.SLIM_VIEW;

const useListSectionSavedState = ({ sessionStorageKey }) => {
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

export default useListSectionSavedState;
