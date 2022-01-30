import React, { useCallback } from 'react';
import Button from 'components/common/Button/Button';
import { Link } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { SUBS_SETTINGS_PATH } from 'routing/helpers/paths';
import Spacing from '../Spacing';
import {
  UpgradePlanContainer,
  Title,
  Description,
  IconContainer,
  UpgradeButtonContainer,
  LearnMoreButtonContainer,
} from './styled';

const UpgradePlan = ({ learnMoreLink, title, description, iconImage }) => {
  const history = useHistory();

  const handleUpgradeClick = useCallback(() => {
    history.push(SUBS_SETTINGS_PATH);
  }, [history]);

  return (
    <UpgradePlanContainer>
      <IconContainer>{iconImage}</IconContainer>
      <Spacing vertical={3} />
      <Title>{title}</Title>
      <Spacing vertical={1} />
      <Description>{description}</Description>
      <Spacing vertical={4} />
      <UpgradeButtonContainer>
        <Button size="small" onClick={handleUpgradeClick}>
          Upgrade now
        </Button>
      </UpgradeButtonContainer>
      {!!learnMoreLink && (
        <>
          <Spacing vertical={3} />
          <LearnMoreButtonContainer>
            <Link
              href={learnMoreLink}
              target="__blank"
              variant="text"
              size="small"
            >
              Learn more
            </Link>
          </LearnMoreButtonContainer>
        </>
      )}
      <Spacing vertical={2} />
    </UpgradePlanContainer>
  );
};

export default UpgradePlan;
