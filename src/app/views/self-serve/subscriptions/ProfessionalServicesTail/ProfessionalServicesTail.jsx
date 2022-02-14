import { Box } from '@material-ui/core';
import React from 'react';
import palette from 'styles/palette';
import SubscriptionPlanFeature from '../SubscriptionPlanFeature/SubscriptionPlanFeature';
import { Container, Name, Description, Price, Units } from './styled';

const ProfessionalServicesTail = () => {
  return (
    <Container>
      <div>
        <Name>
          Professional
          <br />
          Services
        </Name>
        <Description>Add on to basic or premium</Description>
        <Box m={2} />
        <Price>
          $500<Units>/one time</Units>
        </Price>
      </div>
      <div>
        <SubscriptionPlanFeature
          feature="EHR integrations"
          color={palette.white}
        />
        <SubscriptionPlanFeature
          feature="Workflow automations"
          color={palette.white}
        />
        <SubscriptionPlanFeature
          feature="Custom integrations"
          color={palette.white}
        />
        <SubscriptionPlanFeature
          feature="Email automations "
          color={palette.white}
        />
      </div>
      <div>
        <SubscriptionPlanFeature
          feature="Workflow consulting"
          color={palette.white}
        />
        <SubscriptionPlanFeature
          feature="SmartFlow design"
          color={palette.white}
        />
        <SubscriptionPlanFeature
          feature="Organizational training"
          color={palette.white}
        />
      </div>
    </Container>
  );
};

export default ProfessionalServicesTail;
