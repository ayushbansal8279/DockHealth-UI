import React from 'react';
import SortArrowIcon from 'img/SortArrowIcon';
import SecondarySortIcon from 'img/SecondarySortArrowIcon';
import { SortOrderType } from 'helpers/sorting-helper';
import { SortArrowContainer } from './styled';

const SortArrow = ({
  orderType,
  onClick = () => {},
  isParentHovered,
  version = 'primary',
}) => (
  <SortArrowContainer
    type="button"
    onClick={onClick}
    hideIcon={!isParentHovered}
    ordered={!!orderType}
    isUp={orderType === SortOrderType.ASC}
    version={version}
  >
    {version === 'primary' && <SortArrowIcon />}
    {version === 'secondary' && <SecondarySortIcon />}
  </SortArrowContainer>
);

export default SortArrow;
