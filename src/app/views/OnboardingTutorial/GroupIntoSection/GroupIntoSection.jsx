import React, { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MontserratTypography } from 'styles/theme-montserrat';
import Button from 'components/common/v2/Button/Button';
import FormInput from 'components/common/v2/Input/FormInput';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import { Grid } from '@mui/material';
import OnboardingIndicator from 'components/common/OnboardingIndicator/OnboardingIndicator';
import { useHistory } from 'react-router-dom';
import {
  createGroupAssignedToList,
  assignTasksToGroup,
} from 'api/task-group-list-api';
import OnboardingContext from '../OnboardingContext/OnboardingContext';

const validationSchema = object().shape({
  groupName: string().required('Please enter a group name'),
});

const GroupIntoSection = () => {
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const { watch, setValue, handleSubmit, register } = formMethods;

  const groupNameValue = watch('groupName');

  const { step, list, setGroupName, tasks } =
    React.useContext(OnboardingContext);

  useMount(() => {
    setValue('groupName', '');
  });

  const handleListNameChange = (event) => {
    setValue('groupName', event.target?.value || '');
    setGroupName(event.target?.value);
  };

  const history = useHistory();

  const handleBack = () => {
    history.push('/core/home');
  };

  const onSubmit = useCallback(
    (groupName) => {
      createGroupAssignedToList({
        ...groupName,
        taskListIdentifier: list.taskListIdentifier,
      })
        .then((response) => {
          console.log(`create group section`, response);
          const taskIdentifiers = tasks.map(
            ({ taskIdentifier }) => taskIdentifier,
          );
          assignTasksToGroup(response?.taskGroupIdentifier, taskIdentifiers)
            .then((data) => {
              console.log(`grouped successfully`, data);
              history.push(`/core/tasks/${list.taskListIdentifier}`);
            })
            .catch((error) => {
              console.error('error creating group', error);
            });
        })
        .catch((error) => {
          console.log(`error making new group: ${error}`);
        });
    },
    [history, list.taskListIdentifier, tasks],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (error) => {
        console.log(`error on submit:`, error);
      })}
    >
      <FormProvider {...formMethods}>
        <Grid container spacing={2} justifyItems="flex-end">
          <Grid item={12} sx={{ width: 0.99 }}>
            <OnboardingIndicator steps={3} completedSteps={step} />
            <Spacing vertical={5} />
            <MontserratTypography align="center" variant="h3" weight="700">
              Group your tasks into a section
            </MontserratTypography>
            <Spacing vertical={5} />
            <FormInput
              name="groupName"
              type="text"
              label="Group Name"
              value={groupNameValue}
              placeholder="e.g. Clinic Tasks"
              {...register('groupName')}
              onChange={handleListNameChange}
            />
            <Spacing vertical={5} />
          </Grid>
          <Grid item xs={6} />
          <Grid item xs={6} spacing={0} container alignItems="center">
            <Grid item xs={6}>
              <MontserratTypography variant="h3" weight="600" align="center">
                <div style={{ cursor: 'pointer' }} onClick={handleBack}>
                  Skip
                </div>
              </MontserratTypography>
            </Grid>
            <Grid item xs={6}>
              <MontserratTypography weight="600" align="center">
                <Button
                  id="loginButton"
                  size="large"
                  type="submit"
                  color={palette.brightOrange}
                  secondaryColor={palette.oPlusRed}
                >
                  Continue
                </Button>
              </MontserratTypography>
            </Grid>
          </Grid>
        </Grid>
      </FormProvider>
    </form>
  );
};

export default GroupIntoSection;
