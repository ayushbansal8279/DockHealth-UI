import React from 'react';
import { Popover } from '@material-ui/core';
import Spacing from '../Spacing';
import {
  UpgradePlanPopupContainer,
  Header,
  UpgradePlanContent,
} from './styled';
import UpgradePlan from '../UpgradePlan/UpgradePlan';

const UpgradePlanPopup = ({
  header,
  learnMoreLink,
  title,
  description,
  ...restProps
}) => {
  return (
    <Popover
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...restProps}
    >
      <UpgradePlanPopupContainer>
        {header && <Header>{header}</Header>}
        <UpgradePlanContent>
          <UpgradePlan
            learnMoreLink={learnMoreLink}
            title={title}
            description={description}
          />
        </UpgradePlanContent>
      </UpgradePlanPopupContainer>
    </Popover>
  );
};

export default UpgradePlanPopup;
