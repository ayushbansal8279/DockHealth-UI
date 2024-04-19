import React from 'react';
import { fontSizes } from 'styles/font';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import Spacing from 'components/common/Spacing';
import { Box } from '@mui/material';
import AddButton from 'components/common/AddButton/AddButton';
import { LabeledCollapseHeaderButton, LabeledCollapseItemName } from './styled';

const CategoryOptions = ({
  visibility,
  onToggle,
  onAddButtonClick,
  showAddButton = false,
  coreTask,
}) => {
  return (
    <div>
      {coreTask && <Spacing vertical={3} />}
      <Box display="flex" justifyContent="flex-end">
        <div width="auto">
          <LabeledCollapseHeaderButton
            type="button"
            onClick={onToggle}
            width="auto"
            coreTask={coreTask}
          >
            <LabeledCollapseItemName font-size={fontSizes.small}>
              {visibility ? 'Hide Empty Fields' : 'Show Empty Fields'}
            </LabeledCollapseItemName>
            <Spacing horizontal={3} />
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
