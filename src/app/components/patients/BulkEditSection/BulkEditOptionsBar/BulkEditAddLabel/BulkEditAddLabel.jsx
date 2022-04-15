import React from 'react';

import { useForm, FormContext } from 'react-hook-form';
import SecondaryDropdownInput from 'components/common/DropdownInput/SecondaryDropdownInput';

import { DELAY_PERIOD_UNIT_OPTIONS, DelayPeriodUnit } from '../../../../../views/smart-flow-builder/TaskLinkDelayForm/helpers';

const BulkEditAddLabel = () => {

  const formMethods = useForm();
  const { register, unregister, setValue, watch } = formMethods;


  const handleRecurringOptionSelect = e => {
    console.log('HANDLECHANGE', e);
  };

  return (
    <FormContext {...formMethods}>
      <>
        <SecondaryDropdownInput
          name="patientLabel"
          placeholder="Add label"
          value={watch('delayPeriodUnit')}
          onSelect={newValue => setValue('delayPeriodUnit', newValue)}
          width={207}
          options={DELAY_PERIOD_UNIT_OPTIONS}
          showCreateOption
        />
      </>
    </FormContext>
  );
};

export default BulkEditAddLabel;
