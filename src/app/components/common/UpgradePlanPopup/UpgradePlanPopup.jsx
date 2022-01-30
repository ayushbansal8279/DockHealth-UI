import React from 'react';
import { Popover } from '@material-ui/core';
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
  iconImage,
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
            iconImage={iconImage}
          />
        </UpgradePlanContent>
      </UpgradePlanPopupContainer>
    </Popover>
  );
};

export default UpgradePlanPopup;
