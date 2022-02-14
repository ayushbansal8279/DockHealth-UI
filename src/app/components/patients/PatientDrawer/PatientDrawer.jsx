import React from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import UpgradePlan from 'components/common/UpgradePlan/UpgradePlan';
import { useSelector } from 'react-redux';
import { userHasUserGroupsFeatureSelector } from 'selectors/user-selectors';
import CustomFieldsIcon from 'img/premium/custom-fields';
import {
  DrawerWrapper,
  ContentWrapper,
  TitleName,
  StickyHeader,
  MoreActinsWrapper,
  UpgradePlanContainer,
} from './styled';

const PatientDrawer = ({ children, title, options, isOpen, onClose }) => {
  const userGroupsAvailable = useSelector(userHasUserGroupsFeatureSelector);

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
            title="Custom Patient Fields"
            description="Need to customize the patient profile? Create unlimited, personalized fields with Dock Premium."
            iconImage={
              <img src={CustomFieldsIcon} alt="Custom Patient Fields" />
            }
          />
        </UpgradePlanContainer>
      )}
    </DrawerWrapper>
  );
};

export default PatientDrawer;
