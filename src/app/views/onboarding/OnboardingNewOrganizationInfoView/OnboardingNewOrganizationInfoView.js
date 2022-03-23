import { Box, Grid } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Title,
  Description,
  InfoContainer,
  ContinueButtonContainer,
} from './styled';

const OnboardingNewOrganizationInfoView = () => {
  const history = useHistory();
  return (
    <InfoContainer>
      <Title>New Organization</Title>
      <Spacing vertical={4} />
      <Description>
        You are about to create a new organization and start a free 15 day
        trial. Each organization has its own people, patients and tasks which
        are associated with it. You can invite people from other organizations
        to join a list within your organization. That person will then only have
        access to the people, patients and tasks on that list.
      </Description>
      <Spacing vertical={7} />
      <Grid container justify="flex-end">
        <Box flex="1">
          <Button onClick={history.goBack} variant="text" fullWidth>
            Cancel
          </Button>
        </Box>
        <ContinueButtonContainer>
          <Button
            fullWidth
            onClick={() => history.push('/onboarding/create-organization')}
          >
            Continue
          </Button>
        </ContinueButtonContainer>
      </Grid>
    </InfoContainer>
  );
};

export default OnboardingNewOrganizationInfoView;
