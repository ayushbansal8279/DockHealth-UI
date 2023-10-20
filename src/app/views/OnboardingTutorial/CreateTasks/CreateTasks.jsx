import React, { useCallback } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { useMount } from 'react-use';

import { MontserratTypography } from 'styles/theme-montserrat';
import Button from 'components/common/v2/Button/Button';
import FormInput from 'components/common/v2/Input/FormInput';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import {
  Grid,
  TableBody,
  Table,
  TableRow,
  TableContainer,
  TableCell,
} from '@mui/material';
import OnboardingIndicator from 'components/common/OnboardingIndicator/OnboardingIndicator';
import Circle from 'img/circle.svg';
import { addTask } from 'api/task-api';
import { useHistory } from 'react-router-dom';
import OnboardingContext from '../OnboardingContext/OnboardingContext';
import { CircleIcon } from '../Grid/styled';

const CreateTasks = () => {
  const formMethods = useForm({
    defaultValues: {
      tasks: [
        { placeholder: 'e.g. Verify Patient Insurance' },
        { placeholder: 'e.g. Send provider referral' },
        { placeholder: 'e.g. Onboard New Staff Member' },
      ],
    },
  });

  const { setValue, handleSubmit, register, control } = formMethods;

  const { fields } = useFieldArray({
    control,
    name: 'tasks',
  });

  const { tasks, setTasks, step, setStep, list } =
    React.useContext(OnboardingContext);

  useMount(() => {
    setValue('task-1', '');
    setValue('task-2', '');
    setValue('task-3', '');
  });

  const STANDARD_TASK_HEIGHT = 35;

  const history = useHistory();

  const handleBack = useCallback(() => {
    history.push('/core/home');
  }, [history]);

  const onSubmit = useCallback(
    ({ tasks: submitTasks }) => {
      const taskPromises = submitTasks?.map((task) =>
        addTask({
          ...task,
          taskList: { taskListIdentifier: list.taskListIdentifier },
        }),
      );
      Promise.all(taskPromises)
        .then((responseTasks) => {
          setTasks(responseTasks);
        })
        .catch((error) => {
          console.error(`error creating task: ${error}`);
        });
      setStep((previous) => previous + 1);
    },
    [list, setStep, setTasks],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (error) => {
        console.errors(`error on submit: ${JSON.stringify(error)}`);
      })}
    >
      <FormProvider {...formMethods}>
        <Grid container justifyItems="flex-end">
          <Grid item={12} sx={{ width: 0.99 }}>
            <OnboardingIndicator steps={3} completedSteps={step} />
            <Spacing vertical={5} />
            <MontserratTypography align="left" variant="h3" weight="700">
              What are the next 3 tasks you need to complete
            </MontserratTypography>
            <Spacing vertical={4} />
            <TableContainer>
              <div>
                <Table aria-label="simple table">
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow
                        // eslint-disable-next-line react/no-array-index-key
                        key={field.id}
                        sx={{
                          height: STANDARD_TASK_HEIGHT,
                        }}
                      >
                        <TableCell
                          sx={{ width: 75, border: 1, borderColor: '#E5E9F2' }}
                        >
                          <CircleIcon src={Circle} isCompleted={false} />
                        </TableCell>
                        <TableCell
                          sx={{ border: 1, borderColor: '#E5E9F2' }}
                          style={{ height: 'inherit' }}
                        >
                          <FormInput
                            style={{ border: 'none' }}
                            type="text"
                            fullWidth
                            disableUnderline
                            placeholder={field.placeholder}
                            name={`task-${index}`}
                            {...register(`tasks.${index}.description`)}
                            onChange={(event) => {
                              const updatedTasks = tasks.map(
                                (task, updatedIndex) => {
                                  if (updatedIndex === index) {
                                    return {
                                      ...task,
                                      description: event?.target?.value,
                                    };
                                  }
                                  return task;
                                },
                              );
                              setTasks(updatedTasks);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
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
              <Button
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

export default CreateTasks;
