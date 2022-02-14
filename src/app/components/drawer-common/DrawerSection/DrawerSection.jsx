import { Box, Collapse } from '@material-ui/core';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import { useBoolean } from 'hooks/useBoolean';
import React, { useEffect } from 'react';
import palette from 'styles/palette';
import { SectionContainer, Title } from './styled';

const DrawerSection = props => {
  const { title, collapsable, onOpen, children } = props;
  const { 0: isOpen, 3: toggleOpen } = useBoolean(!collapsable);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    if (isOpen) onOpen?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <SectionContainer>
      {collapsable ? (
        <button type="button" onClick={toggleOpen}>
          <Box display="flex" alignItems="center">
            {title && (
              <>
                <Title>{title}</Title>
                <Box mx={0.5} />
              </>
            )}
            {collapsable && (
              <RotatableChevron rotated={isOpen} color={palette.greyBlue} />
            )}
          </Box>
        </button>
      ) : (
        <Title>{title}</Title>
      )}
      <Collapse in={isOpen}>
        {title && <Box my={1} />}
        {children}
      </Collapse>
    </SectionContainer>
  );
};

export default DrawerSection;
