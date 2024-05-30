import React, { useCallback, useState } from 'react';
import Spacing from 'components/common/Spacing';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { Box, Collapse } from '@mui/material';
import PropTypes from 'prop-types';
import {
  LabeledCollapseWrapper,
  LabeledCollapseHeaderButton,
  LabeledCollapseItemName,
} from './styled';

const LabeledCollapse = ({
  children,
  onClick,
  name,
  isOpened,
  noBorder = false,
  isListSubMenu,
}) => {
  const [openedItem, setOpenedItem] = useState(null);

  const handleClick = useCallback(
    (event) => {
      if (typeof isOpened === 'boolean') {
        onClick(name, event);
      } else {
        setOpenedItem(name);
      }
    },
    [isOpened, name, onClick],
  );

  return (
    <LabeledCollapseWrapper noBorder={noBorder}>
      <LabeledCollapseHeaderButton type="button" onClick={handleClick}>
        <RotatableChevron
          color={palette.darkGrey}
          rotated={isOpened || openedItem}
        />
        <Spacing horizontal={4} />
        <LabeledCollapseItemName isListSubMenu={isListSubMenu}>
          {name}
        </LabeledCollapseItemName>
        <Spacing horizontal={3} />
      </LabeledCollapseHeaderButton>
      <Collapse in={isOpened || openedItem}>
        <Box width="100%" py={spacing.small}>
          {children}
        </Box>
      </Collapse>
    </LabeledCollapseWrapper>
  );
};

LabeledCollapse.propTypes = {
  onClick: PropTypes.func,
  name: PropTypes.string,
  children: PropTypes.node.isRequired,
  isOpened: PropTypes.bool.isRequired,
};

LabeledCollapse.defaultProps = {
  onClick: () => {},
  name: '',
};

export default LabeledCollapse;
