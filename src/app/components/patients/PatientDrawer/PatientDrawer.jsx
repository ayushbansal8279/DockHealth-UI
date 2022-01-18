import React from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import UpgradePlan from 'components/common/UpgradePlan/UpgradePlan';
import { useSelector } from 'react-redux';
import { userHasUserGroupsFeatureSelector } from 'selectors/user-selectors';
import {
  DrawerWrapper,
  ContentWrapper,
  TitleName,
  StickyHeader,
  MoreActinsWrapper,
  UpgradePlanContainer,
} from './styled';

const PatientDrawer = ({ children, title, options, isOpen, onClose }) => {
  const userGroupsAvailable = false;
  // const userGroupsAvailable = useSelector(userHasUserGroupsFeatureSelector); //TODO!: TO DELETE

  return (
    <DrawerWrapper open={isOpen} anchor="right" onClose={onClose}>
      <StickyHeader>
        <TitleName>{title}</TitleName>
        <MoreActinsWrapper>
          {options && (
            <OptionsMenu options={options} customButtonComponent={IconButton}>
              <MoreVertIcon />
            </OptionsMenu>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </MoreActinsWrapper>
      </StickyHeader>
      <ContentWrapper>{children}</ContentWrapper>
      {!userGroupsAvailable && (
        <UpgradePlanContainer>
          <UpgradePlan
            title="Custom users groups"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          />
        </UpgradePlanContainer>
      )}
    </DrawerWrapper>
  );
};

export default PatientDrawer;
