import React from 'react';
import { Box } from '@mui/material';
import FeatureCheckmark from 'img/subscription-feature-checkmark.svg';
import { FeatureContainer, FeatureText, ComingSoonText } from './styled';

const SubscriptionPlanFeature = (props) => {
  const { feature, color, comingSoon } = props;
  return (
    <FeatureContainer>
      <img src={FeatureCheckmark} alt="checkmark" />
      <Box m={0.5} />
      <FeatureText color={color}>
        {feature}
        {comingSoon && <ComingSoonText>Coming soon</ComingSoonText>}
      </FeatureText>
    </FeatureContainer>
  );
};

export default SubscriptionPlanFeature;
