import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Checkbox from 'components/common/Checkbox/Checkbox';
import SecondaryDropdownInput from 'components/common/DropdownInput/SecondaryDropdownInput';
import SecondaryNumberInput from 'components/common/NumberInput/SecondaryNumberInput';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
import { FormProvider, useForm } from 'react-hook-form';
import {
  DELAY_PERIOD_UNIT_OPTIONS,
  DelayPeriodUnit,
  TIME_TYPE,
  TIME_REFERENCE,
  TIME_TYPE_OPTIONS,
  TIME_REFERENCE_OPTIONS,
} from './helpers';
import { DelayPeriodForm, Title, CheckboxLabel } from './styled';
import { getPatientCustomField, getWorkflowCustomField } from '@/app/api/task-template-api';

const TaskLinkDelayForm = (props) => {
  const [timeReferenceValue, setTimeReferenceValue]=useState(null);
  const [customFieldOptions, setCustomFieldOptions] = useState([]);
  
  const { link, onSubmit, onClose } = props;
  const formMethods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      delayPeriod: link?.delayPeriod || 3,
      delayPeriodUnit: link?.delayPeriodUnit || DelayPeriodUnit.DAY,
      delayIsBusinessDays: link?.delayIsBusinessDays || false,
      timeRelative: link?.timeRelative || TIME_TYPE.AFTER,
      timeReference: link?.timeReference || Object.keys(TIME_REFERENCE)[0],
    },
  });
  console.log('adfv',link)

  const { watch, setValue, register, unregister, handleSubmit } = formMethods;
  useEffect(() => {
    register('delayPeriod');
    register('delayPeriodUnit');
    register('delayIsBusinessDays');
    register('timeRelative');
    register('timeReference');
    register('customFieldIdentifier');

    return () => {
      unregister('delayPeriod');
      unregister('delayPeriodUnit');
      unregister('delayIsBusinessDays');
      unregister('timeRelative');
      unregister('timeReference');
      unregister('customFieldIdentifier');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [delayPeriodValue, delayPeriodUnit, delayIsBusinessDaysValue] = watch([
    'delayPeriod',
    'delayPeriodUnit',
    'delayIsBusinessDays',
  ]);

  useEffect(() => {
    async function fetchOptions() {
      let options = [];

      if (timeReferenceValue === 'WORKFLOW_CUSTOM_FIELD') {
        options = await getWorkflowCustomField();
      } else if (timeReferenceValue === 'PATIENT_CUSTOM_FIELD') {
        options = await getPatientCustomField();
      }

      const filteredOptions = options
        .filter(field => field.fieldType === 'DATE')
        .map(field => ({ value: field.identifier, label: field.name }));

        setCustomFieldOptions(filteredOptions);
    }
    if (timeReferenceValue) {
      fetchOptions();
    }
  }, [timeReferenceValue]);

  return (
    <FormProvider {...formMethods}>
      <DelayPeriodForm onSubmit={handleSubmit(onSubmit)}>
        <Box py={1} px={2}>
          <Title>Time until next task</Title>
          <Box p={1} />
          <Box width="100%" display="flex" justifyContent="space-between">
            <SecondaryNumberInput
              name="delayPeriod"
              value={delayPeriodValue}
              onChange={(newValue) => {
                if (newValue === '' || Number(newValue) > 0) {
                  setValue(
                    'delayPeriod',
                    newValue === '' ? '' : Number(newValue),
                  );
                }
              }}
              onBlur={() => {
                if (delayPeriodValue === '') setValue('delayPeriod', 1);
              }}
            />
            <SecondaryDropdownInput
              name="delayPeriodUnit"
              placeholder="Select unit"
              value={watch('delayPeriodUnit')}
              width={207}
              onSelect={(newValue) => setValue('delayPeriodUnit', newValue)}
              options={DELAY_PERIOD_UNIT_OPTIONS}
            />
          </Box>
          <Box p={1} />
          <Box width="100%">
            <SecondaryDropdownInput
              name="timeRelative"
              width={275}
              value={watch('timeRelative')}
              onSelect={(newValue) => setValue('timeRelative', newValue)}
              options={TIME_TYPE_OPTIONS}
            />
          </Box>
          <Box p={1} />
          <Box width="100%">
            <SecondaryDropdownInput
              name="timeReference"
              width={275}
              value={watch('timeReference')}
              onSelect={(newValue) => {setTimeReferenceValue(newValue);setValue('timeReference', newValue)}}
              options={TIME_REFERENCE_OPTIONS}
            />
          </Box>
          {['WORKFLOW_CUSTOM_FIELD', 'PATIENT_CUSTOM_FIELD'].includes(timeReferenceValue) && (
            <>
              <Box p={1} />
              <Box width="100%">
                <SecondaryDropdownInput
                  name='customFieldIdentifier'
                  width={275}
                  value={watch('customFieldIdentifier')}
                  onSelect={(newValue) => 
                    setValue('customFieldIdentifier', newValue)}
                  options={customFieldOptions}
                />
              </Box>
            </>
          )}
          <Box p={1} />
          {delayPeriodUnit === DelayPeriodUnit.DAY && (
            <Box width="100%" display="flex" alignItems="center">
              <Checkbox
                isChecked={delayIsBusinessDaysValue}
                onClick={() =>
                  setValue('delayIsBusinessDays', !delayIsBusinessDaysValue)
                }
              />
              <Box p={0.5} />
              <CheckboxLabel>Business days only</CheckboxLabel>
            </Box>
          )}
        </Box>
        <PopoverBottomBar>
          <PopoverBottomBar.Button
            type="button"
            theme="light"
            onClick={onClose}
          >
            Close
          </PopoverBottomBar.Button>
          <PopoverBottomBar.Button type="submit">Ok</PopoverBottomBar.Button>
        </PopoverBottomBar>
      </DelayPeriodForm>
    </FormProvider>
  );
};

export default TaskLinkDelayForm;
