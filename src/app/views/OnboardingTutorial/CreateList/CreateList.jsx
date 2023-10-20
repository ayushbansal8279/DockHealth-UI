/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { setAuthBaseState } from 'actions/auth-base-actions';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';
import { Grid } from '@mui/material';
import { userProfileSelector } from 'selectors/user-selectors';
import Spacing from 'components/common/Spacing';
import OnboardingHeader from 'views/OnboardingTutorial/OnboardingHeader';
import CreateListForm from './CreateListForm';
import OnboardingGrid from '../Grid/OnboardingGrid';
import OnboardingContext from '../OnboardingContext/OnboardingContext';
import CreateTasks from '../CreateTasks/CreateTasks';
import GroupIntoSection from '../GroupIntoSection/GroupIntoSection';

const CreateList = () => {
  const dispatch = useDispatch();

  const confirmStatus = sessionStorage.getItem('confirmStatus');

  const setConfirmationBaseState = useCallback(() => {
    setAuthBaseState({
      authBaseState: confirmStatus
        ? AUTH_BASE_STATES.DAILY_HUB
        : AUTH_BASE_STATES.DEFAULT,
    })(dispatch);
  }, [confirmStatus, dispatch]);

  useMount(() => {
    setConfirmationBaseState();
  });

  useEffect(() => {
    setConfirmationBaseState();
  }, [confirmStatus, setConfirmationBaseState]);

  const [list, setList] = React.useState({});
  const [tasks, setTasks] = React.useState(Array.from({ length: 3 }));

  const [step, setStep] = React.useState(1);

  const [groupName, setGroupName] = React.useState(null);

  const value = React.useMemo(() => {
    return {
      tasks,
      setTasks,
      step,
      setStep,
      list,
      setList,
      groupName,
      setGroupName,
    };
  }, [tasks, step, list, groupName]);

  const currentUser = useSelector(userProfileSelector);

  const renderCreateListStep = () => {
    switch (step) {
      case 1: {
        return <CreateListForm />;
      }
      case 2: {
        return <CreateTasks />;
      }
      case 3: {
        return <GroupIntoSection />;
      }
      default: {
        return <div> Not More Steps </div>;
      }
    }
  };

  return (
    <>
      <OnboardingContext.Provider value={value}>
        <OnboardingHeader currentUser={currentUser} />
        <Spacing vertical={3} />
        <Grid
          container
          spacing={1}
          sx={{ paddingTop: 5, paddingLeft: 5, paddingRight: 5 }}
        >
          <Grid item xs={6} sx={{ padding: 5, height: 0.99 }}>
            {renderCreateListStep()}
          </Grid>
          <Grid item xs={6} sx={{ padding: 0 }}>
            <OnboardingGrid />
          </Grid>
        </Grid>
      </OnboardingContext.Provider>
    </>
  );
};

export default CreateList;
