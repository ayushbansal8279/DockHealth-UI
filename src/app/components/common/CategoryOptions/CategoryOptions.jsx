import React from 'react';
import { fontSizes } from 'styles/font';
import Spacing from 'components/common/Spacing';
import { Box } from '@mui/material';
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
      <Box display="flex" justifyContent="flex-end">
        <LabeledCollapseHeaderButton
          type="button"
          onClick={onToggle}
          width="auto"
        >
          <LabeledCollapseItemName font-size={fontSizes.small}>
            {visibility ? 'Hide empty fields' : 'Show empty fields'}
          </LabeledCollapseItemName>
          <Spacing horizontal={3} />
        </LabeledCollapseHeaderButton>
      </Box>
      <Box display="flex" justifyContent="flex-end">
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
