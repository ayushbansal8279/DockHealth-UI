import React from 'react';
import { fontSizes } from 'styles/font';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import Spacing from 'components/common/Spacing';
import { Box } from '@material-ui/core';
import AddButton from 'components/common/AddButton/AddButton';
import { LabeledCollapseHeaderButton, LabeledCollapseItemName } from './styled';

const CategoryOptions = ({
  visibility,
  onToggle,
  onAddButtonClick,
  showAddButton = false,
}) => {
  return (
    <div>
      <Spacing vertical={3} />
      <Box display="flex" justifyContent="space-between">
        <div width="auto">
          <LabeledCollapseHeaderButton
            type="button"
            onClick={onToggle}
            width="auto"
          >
            <Spacing horizontal={3} />
            <LabeledCollapseItemName font-size={fontSizes.small}>
              {visibility ? 'Hide empty fields' : 'Show empty fields'}
            </LabeledCollapseItemName>
            <Spacing horizontal={3} />
            <RotatableChevron rotated={visibility} />
          </LabeledCollapseHeaderButton>
        </div>
        {showAddButton && typeof onAddButtonClick === 'function' && (
          <AddButton width="auto" onClick={onAddButtonClick}>
            Add or edit fields
          </AddButton>
        )}
      </Box>
    </div>
  );
};

export default CategoryOptions;
