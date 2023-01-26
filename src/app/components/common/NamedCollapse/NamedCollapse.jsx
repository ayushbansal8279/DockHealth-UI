import React from 'react';
import { useBoolean } from 'hooks/useBoolean';
import { Box } from '@mui/material';
import MuiCollapse from '@mui/material/Collapse';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import { ToggleButton, Text } from './styled';

const NamedCollapse = (props) => {
  const { name, children } = props;
  const { 0: isOpen, 3: toggleOpen } = useBoolean(true);

  return (
    <Box mb={2}>
      <ToggleButton
        type="button"
        onClick={toggleOpen}
        onDragOver={() => {
          if (!isOpen) toggleOpen();
        }}
      >
        <RotatableChevron rotated={isOpen} /> <Text>{name}</Text>
      </ToggleButton>
      <MuiCollapse in={isOpen}>
        <Box width="100%" pt={2}>
          {children}
        </Box>
      </MuiCollapse>
    </Box>
  );
};

export default NamedCollapse;
