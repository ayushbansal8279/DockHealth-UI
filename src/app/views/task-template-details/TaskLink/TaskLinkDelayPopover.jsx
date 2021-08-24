import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Popover } from '@material-ui/core';
import { updateTasksLink } from 'actions/task-actions';
import Checkbox from 'components/common/Checkbox/Checkbox';
import SecondaryDropdownInput from 'components/common/DropdownInput/SecondaryDropdownInput';
import SecondaryNumberInput from 'components/common/NumberInput/SecondaryNumberInput';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
import { FormContext, useForm } from 'react-hook-form';
import { DELAY_PERIOD_UNIT_OPTIONS, DelayPeriodUnit } from './helpers';
import { DelayPeriodForm, Title, CheckboxLabel } from './styled';

const TaskLinkDelayPopover = props => {
  const { anchorEl, link, onClose } = props;
  const dispatch = useDispatch();
  const formMethods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      delayPeriod: link.delayPeriod || 3,
      delayPeriodUnit: link.delayPeriodUnit || DelayPeriodUnit.DAY,
      delayIsBusinessDays: link.delayIsBusinessDays || false,
    },
  });
  const { watch, setValue, register, unregister, handleSubmit } = formMethods;

  useEffect(() => {
    register('delayPeriod');
    register('delayPeriodUnit');
    register('delayIsBusinessDays');

    return () => {
      unregister('delayPeriod');
      unregister('delayPeriodUnit');
      unregister('delayIsBusinessDays');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const delayPeriodValue = watch('delayPeriod');
  const delayIsBusinessDaysValue = watch('delayIsBusinessDays');

  const onSubmit = delayPeriodData => {
    dispatch(
      updateTasksLink({
        ...link,
        isDependent: true,
        ...delayPeriodData,
      }),
    );
    onClose();
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open
      onClose={onClose}
    >
      <FormContext {...formMethods}>
        <DelayPeriodForm onSubmit={handleSubmit(onSubmit)}>
          <Box py={1} px={2}>
            <Title>Time till next task</Title>
            <Box p={1} />
            <Box width="100%" display="flex" justifyContent="space-between">
              <SecondaryNumberInput
                name="delayPeriod"
                value={delayPeriodValue}
                onChange={newValue => {
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
                onSelect={newValue => setValue('delayPeriodUnit', newValue)}
                width={207}
                options={DELAY_PERIOD_UNIT_OPTIONS}
              />
            </Box>
            <Box p={1} />
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
      </FormContext>
    </Popover>
  );
};

export default TaskLinkDelayPopover;
