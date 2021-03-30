import React, { useCallback, useState } from 'react';
import { Box } from '@material-ui/core';
import SortArrow from 'components/common/SortArrow/SortArrow';
import { SortOrderType } from 'helpers/sorting-helper';
import { SortHeaderButton } from './styled';

interface ColumnSortHeaderProps {
  id: string;
  label?: string;
  sort: { key: string | null; order: string | null };
  width?: number;
  onSortChange?: (key: string | null, order: string | null) => void;
}

const DashboardColumnSortHeader: React.FC<ColumnSortHeaderProps> = ({
  id,
  label,
  sort,
  onSortChange,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const switchSort = useCallback(() => {
    if (typeof onSortChange !== 'function') return;

    const { key, order } = sort || {};

    if (!key || key !== id) {
      onSortChange(id, SortOrderType.ASC);
    } else {
      switch (order) {
        case null:
          onSortChange(id, SortOrderType.ASC);
          break;
        case SortOrderType.ASC:
          onSortChange(id, SortOrderType.DESC);
          break;
        case SortOrderType.DESC:
          onSortChange(id, SortOrderType.DEFAULT);
          break;
        default:
          onSortChange(id, SortOrderType.DEFAULT);
          break;
      }
    }
  }, [id, sort, onSortChange]);

  return (
    <SortHeaderButton
      disabled={!label}
      type="button"
      onClick={switchSort}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {id && label && typeof onSortChange === 'function' && (
        <SortArrow
          isParentHovered={isHovered}
          orderType={id === sort?.key && sort?.order}
        />
      )}
      <Box m={0.25} />
      <div>{label}</div>
    </SortHeaderButton>
  );
};

export default DashboardColumnSortHeader;
