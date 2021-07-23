import React from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import {
  DrawerWrapper,
  ContentWrapper,
  TitleName,
  StickyHeader,
  MoreActinsWrapper,
} from './styled';

const PatientDrawer = ({ children, title, options, isOpen, onClose }) => {
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
    </DrawerWrapper>
  );
};

export default PatientDrawer;
