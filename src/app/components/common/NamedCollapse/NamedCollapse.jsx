import React from 'react';
import { useBoolean } from 'hooks/useBoolean';
import { Box } from '@material-ui/core';
import MuiCollapse from '@material-ui/core/Collapse';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import { ToggleButton, Text } from './styled';

const NamedCollapse = props => {
  const { name, children } = props;
  const { 0: isOpen, 3: toggleOpen } = useBoolean(true);

  return (
    <Box mb={2}>
      <ToggleButton type="button" onClick={toggleOpen}>
        <RotatableChevron /> <Text>{name}</Text>
      </ToggleButton>
      <MuiCollapse in={isOpen}>{children}</MuiCollapse>
    </Box>
  );
};

export default NamedCollapse;
