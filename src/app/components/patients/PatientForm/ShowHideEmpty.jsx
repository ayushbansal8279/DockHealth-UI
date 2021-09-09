import React from 'react';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import Spacing from 'components/common/Spacing';
import { Box } from '@material-ui/core';
import AddButton from 'components/common/AddButton/AddButton';
import { CUSTOM_FIELDS_SETTINGS_PATH } from 'routing/helpers/paths';
import { useHistory } from 'react-router-dom';
import { LabeledCollapseHeaderButton, LabeledCollapseItemName } from './styled';

const CategoryOptions = ({ visibility, onToggle, isAdmin = false }) => {
  const history = useHistory();

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
              {visibility ? 'Hide Empty' : 'Show Empty'}
            </LabeledCollapseItemName>
            <Spacing horizontal={3} />
            <RotatableChevron color={palette.darkGrey} rotated={visibility} />
          </LabeledCollapseHeaderButton>
        </div>
        {isAdmin && (
          <AddButton
            width="auto"
            onClick={() => history.push(CUSTOM_FIELDS_SETTINGS_PATH)}
          >
            Add or edit fields
          </AddButton>
        )}
      </Box>
    </div>
  );
};

export default CategoryOptions;
