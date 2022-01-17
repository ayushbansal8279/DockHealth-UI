import React from 'react';
import Button from 'components/common/Button/Button';
import Spacing from '../Spacing';
import {
  UpgradePlanContainer,
  Title,
  Description,
  IconContainer,
  UpgradeButtonContainer,
  LearnMoreButtonContainer,
} from './styled';

const UpgradePlan = ({
  displayLearnMoreButton = false,
  title,
  description,
}) => (
  <UpgradePlanContainer>
    <IconContainer>ICON</IconContainer>
    <Spacing vertical={3} />
    <Title>{title}</Title>
    <Spacing vertical={1} />
    <Description>{description}</Description>
    <Spacing vertical={4} />
    <UpgradeButtonContainer>
      <Button size="small">Upgrade now</Button>
    </UpgradeButtonContainer>
    {displayLearnMoreButton && (
      <>
        <Spacing vertical={1} />
        <LearnMoreButtonContainer>
          <Button variant="text" size="small">
            Learn more
          </Button>
        </LearnMoreButtonContainer>
      </>
    )}
    <Spacing vertical={2} />
  </UpgradePlanContainer>
);

export default UpgradePlan;
