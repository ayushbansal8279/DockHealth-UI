import React, { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { OutfitTypography } from 'styles/theme-outfit';
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
    history.push(`/core/tasks/${list.taskListIdentifier}`);
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
            <OutfitTypography align="center" variant="h3" weight="700">
              Group your tasks into a section
            </OutfitTypography>
            <Spacing vertical={5} />
            <FormInput
              name="groupName"
              type="text"
              // label="Group Name"
              autoComplete="off"
              value={groupNameValue}
              placeholder="e.g. Clinic Tasks"
              {...register('groupName')}
              onChange={handleListNameChange}
            />
            <Spacing vertical={5} />
          </Grid>
          <Grid item xs={6} />
          <Grid
            mt={6}
            ml={20}
            xs={9}
            spacing={0}
            container
            alignItems="center"
            justifyContent="flex-end"
          >
            <Grid item xs={2}>
              <OutfitTypography weight="400" align="center">
                <div
                  style={{ cursor: 'pointer', fontSize: '17px' }}
                  onClick={handleBack}
                >
                  Skip
                </div>
              </OutfitTypography>
            </Grid>
            <Grid item xs={6}>
              <Button
                uppercase={false}
                id="loginButton"
                size="large"
                fullWidth
                type="submit"
                color={palette.brightOrange}
                secondaryColor={palette.oPlusRed}
              >
                <OutfitTypography variant="h4">
                  Continue to My List
                </OutfitTypography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </FormProvider>
    </form>
  );
};

export default GroupIntoSection;
