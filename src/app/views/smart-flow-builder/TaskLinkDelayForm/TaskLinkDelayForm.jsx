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
import {
  getPatientCustomField,
  getWorkflowCustomField,
} from '@/app/api/task-template-api';

const TaskLinkDelayForm = (props) => {
  const { link, onSubmit, onClose, removeButtonVisible, onRemove } = props;
  const formMethods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      delayPeriod: link?.delayPeriod || 3,
      delayPeriodUnit: link?.delayPeriodUnit || DelayPeriodUnit.DAY,
      delayIsBusinessDays: link?.delayIsBusinessDays || false,
      timeRelative: link?.timeRelative || TIME_TYPE.AFTER,
      timeReference: link?.timeReference || Object.keys(TIME_REFERENCE)[0],
      customFieldIdentifier: link?.customFieldIdentifier || null,
    },
  });

  const { watch, setValue, register, unregister, handleSubmit } = formMethods;
  useEffect(() => {
    register('delayPeriod');
    register('delayPeriodUnit');
    register('delayIsBusinessDays');
    register('timeRelative');
    register('timeReference');
    register('customFieldIdentifier');
    register('customFieldName');

    return () => {
      unregister('delayPeriod');
      unregister('delayPeriodUnit');
      unregister('delayIsBusinessDays');
      unregister('timeRelative');
      unregister('timeReference');
      unregister('customFieldIdentifier');
      unregister('customFieldName');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [
    delayPeriodValue,
    delayPeriodUnit,
    delayIsBusinessDaysValue,
    timeReferenceValue,
  ] = watch([
    'delayPeriod',
    'delayPeriodUnit',
    'delayIsBusinessDays',
    'timeReference',
  ]);
  const [customFieldOptions, setCustomFieldOptions] = useState([]);

  useEffect(() => {
    async function fetchOptions() {
      const isCustomDate =
        timeReferenceValue === 'WORKFLOW_CUSTOM_FIELD_DATE' ||
        timeReferenceValue === 'PATIENT_CUSTOM_FIELD_DATE';

      if (!isCustomDate) {
        setCustomFieldOptions([]);
        setValue('customFieldIdentifier', null);
        return;
      }

      const options =
        timeReferenceValue === 'WORKFLOW_CUSTOM_FIELD_DATE'
          ? await getWorkflowCustomField()
          : await getPatientCustomField();

      const filteredOptions = options
        .filter((field) => field.fieldType === 'DATE')
        .map((field) => ({
          value: field.identifier,
          label: field.name,
        }));

      setCustomFieldOptions(filteredOptions);

      const currentValue = watch('customFieldIdentifier');

      if (!currentValue && filteredOptions.length > 0) {
        setValue('customFieldIdentifier', filteredOptions[0].value);
      }
    }

    fetchOptions();
  }, [timeReferenceValue, setValue, watch]);

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
              onSelect={(newValue) => {
                setValue('timeReference', newValue);
                setValue('customFieldIdentifier', null);
                setValue('customFieldName', null);
              }}
              options={TIME_REFERENCE_OPTIONS}
            />
          </Box>
          {['WORKFLOW_CUSTOM_FIELD_DATE', 'PATIENT_CUSTOM_FIELD_DATE'].includes(
            timeReferenceValue,
          ) && (
            <>
              <Box p={1} />
              <Box width="100%">
                <SecondaryDropdownInput
                  name="customFieldIdentifier"
                  width={275}
                  value={watch('customFieldIdentifier')}
                  onSelect={(newValue) =>
                    setValue('customFieldIdentifier', newValue)
                  }
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

        <PopoverBottomBar align="spread">
          <div style={{ display: 'flex', flex: 1 }}>
            {removeButtonVisible && (
              <PopoverBottomBar.RemoveButton
                type="button"
                onClick={() => {
                  onRemove();
                  onClose();
                }}
              >
                Remove
              </PopoverBottomBar.RemoveButton>
            )}
          </div>
          <div style={{ display: 'flex' }}>
            <PopoverBottomBar.Button
              type="button"
              theme="light"
              onClick={onClose}
            >
              Close
            </PopoverBottomBar.Button>
            <PopoverBottomBar.Button type="submit">Ok</PopoverBottomBar.Button>
          </div>
        </PopoverBottomBar>
      </DelayPeriodForm>
    </FormProvider>
  );
};

export default TaskLinkDelayForm;
