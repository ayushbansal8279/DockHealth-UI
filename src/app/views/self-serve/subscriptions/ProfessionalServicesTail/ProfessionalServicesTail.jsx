import { Box } from '@mui/material';
import React from 'react';
import palette from 'styles/palette';
import SubscriptionPlanFeature from '../SubscriptionPlanFeature/SubscriptionPlanFeature';
import {
  Container,
  Name,
  Description,
  Price,
  Units,
  PurchaseButton,
  CheckIcon,
  Level,
} from './styled';

const ProfessionalServicesTail = (props) => {
  const { active, setSelectedProfessionalServices } = props;

  const handleOnClick = () => {
    setSelectedProfessionalServices(!active);
  };

  return (
    <Container>
      <div>
        <Name>
          Professional
          <br />
          Services
        </Name>
        <Level>Level 1</Level>
        <Description>Add on to basic or premium</Description>
        <Box m={2} />
        <Price>
          $500<Units>/one time</Units>
        </Price>
        {/* Professional setup for teams looking for standard integrations and some workflow customization */}
        <PurchaseButton
          type="button"
          active={active}
          color={palette.midnightBlue}
          backgroundColor={palette.midnightBlue}
          onClick={handleOnClick}
        >
          <Box component="span" position="relative">
            {active && <CheckIcon />}
            {active ? 'Included' : `Add To Purchase`}
          </Box>
        </PurchaseButton>
      </div>
      <div>
        <SubscriptionPlanFeature
          feature="2 weeks of engagement"
          color={palette.midnightBlue}
        />
        <SubscriptionPlanFeature
          feature="Up to 4 hours training/consultings"
          color={palette.midnightBlue}
        />
        <SubscriptionPlanFeature
          feature="2 SmartFlow/workflow custom designs"
          color={palette.midnightBlue}
        />
        <SubscriptionPlanFeature
          feature="Standard EHR integration (patient demographics and SSO, if available): Athenahealth, Elation, Dr. Chrono, Kareo, AdvancedMD"
          color={palette.midnightBlue}
        />
        <SubscriptionPlanFeature
          feature="Standard Productivity Tool Integration: IntakeQ, JotForm, Typeform, Gmail, Google Forms"
          color={palette.midnightBlue}
        />
        <SubscriptionPlanFeature
          feature="2 automations (from above in any combination)"
          color={palette.midnightBlue}
        />
      </div>
    </Container>
  );
};

export default ProfessionalServicesTail;
