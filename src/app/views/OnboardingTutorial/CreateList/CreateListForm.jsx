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
import { addTaskList } from 'api/task-list-api';
import { useHistory } from 'react-router-dom';
import OnboardingContext from '../OnboardingContext/OnboardingContext';

const validationSchema = object().shape({
  listName: string().required('Please enter a list name'),
});

const CreateListForm = () => {
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const { watch, setValue, handleSubmit, register } = formMethods;

  const listNameValue = watch('listName');

  const { step, setStep, list, setList } = React.useContext(OnboardingContext);

  useMount(() => {
    setValue('listName', '');
  });

  const handlelistNameChange = (event) => {
    setValue('listName', event.target?.value || '');

    setList({ ...list, listName: event.target?.value });
  };

  const history = useHistory();

  const handleBack = useCallback(() => {
    history.push('/core/home');
  }, [history]);

  const onSubmit = useCallback(
    (listValues) => {
      addTaskList({ ...listValues })
        .then((response) => {
          setList({ ...response });
        })
        .catch((error) => {
          console.log(`error: ${error}`);
        });
      setStep(step + 1);
    },
    [setList, setStep, step],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...formMethods}>
        <Grid container spacing={2} justifyItems="flex-end">
          <Grid item={12}>
            <OnboardingIndicator steps={3} completedSteps={step} />
            <Spacing vertical={5} />
            <OutfitTypography align="center" variant="h3" weight="700">
              Get started with your first list
            </OutfitTypography>
            <Spacing vertical={4} />
            <OutfitTypography align="left" variant="h4">
              Lists are where you organize your tasks. You can create as many
              lists as you like, and name them whatever you want.
            </OutfitTypography>
            <Spacing vertical={5} />
            <FormInput
              autoComplete="off"
              name="listName"
              type="text"
              label="List Name"
              value={listNameValue}
              placeholder="e.g. Patient Onboarding or My Personal Tasks"
              {...register('listName')}
              onChange={handlelistNameChange}
            />
            <Spacing vertical={5} />
          </Grid>
          <Grid item xs={6} />
          <Grid item xs={6} spacing={0} container alignItems="center">
            <Grid item xs={6}>
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
                type="submit"
                color={palette.brightOrange}
                secondaryColor={palette.oPlusRed}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </FormProvider>
    </form>
  );
};

export default CreateListForm;
