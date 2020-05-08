/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useRef, useState } from 'react';

import useBoolean from 'hooks/useBoolean';

const initializeTaskDrawerPopoverHooks = () => {
  // patient input
  const patientInputReference = useRef(null);
  const [
    isPatientPopoverOpen,
    openPatientPopover,
    closePatientPopover,
  ] = useBoolean(false);

  const [patientInputValue, setPatientInputValue] = useState('');

  const onPatientInputChange = useCallback((_event, value, reason) => {
    // console.log(`${reason} - ${value}`);
    // if (reason === 'input') {
    //   setPatientInputValue(value);
    // }
  }, []);

  // assigned to input
  const assignedToInputReference = useRef(null);
  const [
    isInvitePopoverOpen,
    openInvitePopover,
    closeInvitePopover,
  ] = useBoolean(false);

  const [assignedToInputValue, setAssignedToInputValue] = useState('');

  const onAssignedToInputChange = useCallback((_event, value, reason) => {
    if (reason === 'input') {
      setAssignedToInputValue(value);
    }
  }, []);

  return {
    patientInputReference,
    isPatientPopoverOpen,
    openPatientPopover,
    closePatientPopover,
    patientInputValue,
    onPatientInputChange,

    assignedToInputReference,
    isInvitePopoverOpen,
    openInvitePopover,
    closeInvitePopover,
    assignedToInputValue,
    onAssignedToInputChange,
  };
};

export default initializeTaskDrawerPopoverHooks;
