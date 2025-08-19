import React, { useCallback, useState } from 'react';
import Spacing from 'components/common/Spacing';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { Box, Collapse } from '@mui/material';
import {
  LabeledCollapseWrapper,
  LabeledCollapseHeaderButton,
  LabeledCollapseItemName,
  AddButton,
  NameWrapper,
} from './styled';
import { AddIcon } from '@/app/views/smart-flow-builder/TaskNodeHandles/styled';

interface NewLabeledCollapseProps {
  children: React.ReactNode;
  onClick: (name: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  name: string;
  isOpened: boolean;
  addButtonClick: () => void;
}

const NewLabeledCollapse = ({
  children,
  onClick,
  name,
  isOpened,
  addButtonClick,
}: NewLabeledCollapseProps) => {
  const [openedItem, setOpenedItem] = useState();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (typeof isOpened === 'boolean') {
        onClick(name, event);
      } else {
        setOpenedItem(name as any);
      }
    },
    [isOpened, name, onClick],
  );

  const handleAddClick = useCallback(() => {
    addButtonClick();
  }, [addButtonClick]);

  return (
    <LabeledCollapseWrapper>
      <NameWrapper>
        <LabeledCollapseHeaderButton type="button" onClick={handleClick}>
          <RotatableChevron
            color={palette.darkGrey}
            rotated={Boolean(isOpened || openedItem)}
          />
          {/* @ts-ignore */}
          <Spacing horizontal={4} />
          <LabeledCollapseItemName>{name}</LabeledCollapseItemName>
          {/* @ts-ignore */}
          <Spacing horizontal={3} />
        </LabeledCollapseHeaderButton>
        {isOpened && (
          <AddButton onClick={handleAddClick}>
            <AddIcon /> Add
          </AddButton>
        )}
      </NameWrapper>
      <Collapse in={isOpened || openedItem}>
        <Box width="100%" py={spacing.small}>
          {children}
        </Box>
      </Collapse>
    </LabeledCollapseWrapper>
  );
};

export default NewLabeledCollapse;
