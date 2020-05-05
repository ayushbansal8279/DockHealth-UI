/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useRef, useState } from 'react';

import useBoolean from 'hooks/useBoolean';

const initializeTaskDrawerTopSectionHooks = () => {
  const filedInInputReference = useRef(null);
  const [
    isFiledInPopoverOpen,
    openFiledInPopover,
    closeFiledInPopover,
  ] = useBoolean(false);

  const [filedInInputValue, setFiledInInputValue] = useState('');

  const onFiledInInputChange = useCallback((_event, value, reason) => {
    if (reason === 'input') {
      setFiledInInputValue(value);
    }
  }, []);

  const taskMenuReference = useRef(null);
  const [
    isTaskMenuPopoverOpen,
    openTaskMenuPopover,
    closeTaskMenuPopover,
  ] = useBoolean(false);

  return {
    filedInInputReference,
    isFiledInPopoverOpen,
    openFiledInPopover,
    closeFiledInPopover,
    filedInInputValue,
    onFiledInInputChange,

    taskMenuReference,
    isTaskMenuPopoverOpen,
    openTaskMenuPopover,
    closeTaskMenuPopover,
  };
};

export default initializeTaskDrawerTopSectionHooks;
